// src/utils/algorithms/a-star.ts
// Implementación del algoritmo A* para búsqueda de rutas óptimas en el campus

export interface Node {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  type: string;
  buildingId: string | null;
}

export interface Edge {
  from: string;
  to: string;
  distance: number; // en metros
  type: 'sidewalk' | 'stairs' | 'ramp' | 'steep' | 'road' | 'main-path';
  baseWeight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface PathStep {
  nodeId: string;
  nodeName: string;
  distanceFromPrevious: number;
  cumulativeDistance: number;
  instructions: string;
}

export interface PathResult {
  path: string[]; // IDs de nodos
  totalDistance: number;
  steps: PathStep[];
  nodes: Node[];
}

// Factores de movilidad (multiplicadores de peso)
const MOBILITY_FACTORS = {
  walking: {
    sidewalk: 1.0,
    stairs: 1.1,    // Pequeña penalización
    ramp: 1.0,
    steep: 1.3,
    road: 5.0,       // Evita calles (peligroso)
    'main-path': 1.0  // ← AGREGAR
  },
  wheelchair: {
    sidewalk: 1.0,
    stairs: 1000.0, // EVITA COMPLETAMENTE escaleras
    ramp: 1.0,      // Prefiere rampas
    steep: 5.0,     // Evita pendientes pronunciadas
    road: 3.0,
    'main-path': 1.0  // ← AGREGAR
  },
  car: {
    sidewalk: 1000.0, // NO PUEDE en aceras
    stairs: 1000.0,
    ramp: 1000.0,
    steep: 1000.0,
    road: 1.0,        // SOLO en caminos/roads
    'main-path': 1000.0  // ← AGREGAR
  }
};

type MobilityType = keyof typeof MOBILITY_FACTORS;

/**
 * Calcula distancia en metros entre dos coordenadas (fórmula Haversine)
 */
function calculateDistance(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371000; // Radio de la Tierra en metros
  const lat1 = coord1.lat * Math.PI / 180;
  const lat2 = coord2.lat * Math.PI / 180;
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Heurística para A* (distancia en línea recta hasta el destino)
 */
function heuristic(node: Node, targetNode: Node): number {
  return calculateDistance(node.coordinates, targetNode.coordinates);
}

/**
 * Implementación del algoritmo A*
 */
export function findPathAStar(
  graph: Graph,
  startId: string,
  endId: string,
  mobility: MobilityType = 'walking'
): PathResult | null {
  // Encontrar nodos de inicio y fin
  const startNode = graph.nodes.find(n => n.id === startId);
  const endNode = graph.nodes.find(n => n.id === endId);

  if (!startNode || !endNode) {
    console.log('=== A* DEBUG ===');
    console.log('Buscando camino de:', startId, 'a:', endId);
    console.log('Total edges:', graph.edges.length);
    console.log('Edges desde puerta-1:', graph.edges.filter(e => e.from === 'puerta-1' || e.to === 'puerta-1').length);
    console.log('Eddes hacia biblioteca:', graph.edges.filter(e => e.from === 'biblioteca' || e.to === 'biblioteca').length);
    console.error('Nodos de inicio o fin no encontrados');
    return null;
  }

  // Estructuras para el algoritmo
  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  
  const gScore = new Map<string, number>(); // Costo real desde inicio
  const fScore = new Map<string, number>(); // Costo estimado total (g + h)

  // Inicializar scores
  graph.nodes.forEach(node => {
    gScore.set(node.id, Infinity);
    fScore.set(node.id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, heuristic(startNode, endNode));

  let iterationCount = 0;
  const MAX_ITERATIONS = 1000;

  while (openSet.size > 0 && iterationCount < MAX_ITERATIONS) {
    iterationCount++;
    
    // Encontrar nodo con menor fScore
    let currentId = '';
    let lowestFScore = Infinity;

    for (const nodeId of openSet) {
      const score = fScore.get(nodeId) || Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        currentId = nodeId;
      }
    }

    console.log(`📊 A* iteración ${iterationCount}, current: ${currentId}, openSet: ${openSet.size}`);

    // Si llegamos al destino
    if (currentId === endId) {
      console.log('🎯 ¡Destino alcanzado!');
      try {
        const result = reconstructPath(graph, cameFrom, currentId, gScore);
        console.log('✅ reconstructPath retornó resultado exitosamente');
        return result;
      } catch (error) {
        console.error('💥 ERROR FATAL en reconstructPath:', error);
        if (error instanceof Error) {
          console.error('Stack trace:', error.stack);
        } else {
          console.error('Error desconocido:', error);
        }
        console.error('Detalles:', { currentId, cameFromSize: cameFrom.size });
        return null;
      }
    }

    openSet.delete(currentId);
    const currentNode = graph.nodes.find(n => n.id === currentId)!;

    // Revisar vecinos
    const neighborEdges = graph.edges.filter(e => e.from === currentId || e.to === currentId);

    for (const edge of neighborEdges) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);

      if (!neighborNode) continue;

      // Calcular peso considerando movilidad
      const mobilityFactor = MOBILITY_FACTORS[mobility][edge.type];
      const tentativeGScore = (gScore.get(currentId) || 0) + (edge.distance * mobilityFactor);

      if (tentativeGScore < (gScore.get(neighborId) || Infinity)) {
        // Este camino es mejor
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeGScore);
        fScore.set(neighborId, tentativeGScore + heuristic(neighborNode, endNode));
        
        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  if (iterationCount >= MAX_ITERATIONS) {
    console.error('❌ A* excedió el límite de iteraciones');
  } else {
    console.error('❌ A* no encontró ruta');
  }
  
  return null;
}

/**
 * Reconstruye el camino a partir del mapa cameFrom
 */
function reconstructPath(
  graph: Graph,
  cameFrom: Map<string, string>,
  currentId: string,
  gScore: Map<string, number>
): PathResult {
  console.log('🔨 reconstructPath llamado para currentId:', currentId);
  console.log('cameFrom entries:', Array.from(cameFrom.entries()));
  
  try {
    const path: string[] = [];
    const visited = new Set<string>(); // Para detectar y evitar ciclos
    let currentNodeId: string | undefined = currentId;

    // Reconstruir camino hacia atrás con detección de ciclos
    while (currentNodeId && !visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      path.unshift(currentNodeId);
      currentNodeId = cameFrom.get(currentNodeId);
    }

    // Si detectamos un ciclo, lo cortamos
    if (currentNodeId && visited.has(currentNodeId)) {
      console.log('⚠️ Se detectó un ciclo, cortando en:', currentNodeId);
      // El ciclo ya está manejado por el while, path contiene el camino sin ciclos
    }

    console.log('📍 Path reconstruido (sin ciclos):', path);
    console.log('📍 Longitud del path:', path.length);

    if (path.length === 0) {
      throw new Error('Path reconstruido está vacío');
    }

    // Obtener nodos completos
    const nodesInPath = path.map(id => {
      const node = graph.nodes.find(n => n.id === id);
      if (!node) {
        throw new Error(`Nodo ${id} no encontrado en el grafo`);
      }
      return node;
    });
    
    console.log('📍 Nodos encontrados en path:', nodesInPath.length);
    console.log('📍 Primer y último nodo:', {
      primero: nodesInPath[0]?.name,
      ultimo: nodesInPath[nodesInPath.length - 1]?.name
    });

    // Crear pasos con instrucciones
    const steps: PathStep[] = [];
    let cumulativeDistance = 0;

    for (let i = 0; i < path.length; i++) {
      const nodeId = path[i];
      const node = nodesInPath[i];
      
      let distanceFromPrevious = 0;
      if (i > 0) {
        const prevNodeId = path[i - 1];
        const edge = graph.edges.find(e => 
          (e.from === prevNodeId && e.to === nodeId) ||
          (e.from === nodeId && e.to === prevNodeId)
        );
        distanceFromPrevious = edge?.distance || 0;
        cumulativeDistance += distanceFromPrevious;
      }

      let instructions = '';
      if (i === 0) {
        instructions = 'Comience aquí';
      } else if (i === path.length - 1) {
        instructions = 'Ha llegado a su destino';
      } else {
        instructions = 'Continúe por el camino';
      }

      steps.push({
        nodeId,
        nodeName: node.name,
        distanceFromPrevious,
        cumulativeDistance,
        instructions
      });
    }

    const result: PathResult = {
      path,
      totalDistance: cumulativeDistance,
      steps,
      nodes: nodesInPath
    };

    console.log('✅ reconstructPath completado exitosamente:', {
      totalDistance: result.totalDistance,
      steps: result.steps.length,
      nodes: result.nodes.length,
      path: result.path
    });

    return result;

  } catch (error) {
    console.error('❌ ERROR CRÍTICO en reconstructPath:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
}

/**
 * Encuentra el nodo más cercano a unas coordenadas
 */
export function findNearestNode(
  graph: Graph,
  coordinates: { lat: number; lng: number }
): Node | null {
  if (graph.nodes.length === 0) return null;

  let nearestNode = graph.nodes[0];
  let shortestDistance = calculateDistance(coordinates, nearestNode.coordinates);

  for (const node of graph.nodes.slice(1)) {
    const distance = calculateDistance(coordinates, node.coordinates);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestNode = node;
    }
  }

  return nearestNode;
}