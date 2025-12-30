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
  type: 'sidewalk' | 'stairs' | 'ramp' | 'steep' | 'road';
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
    stairs: 1.2,
    ramp: 1.0,
    steep: 1.5,
    road: 2.0 // peligroso para peatón
  },
  wheelchair: {
    sidewalk: 1.0,
    stairs: 10.0, // evita completamente
    ramp: 1.0,
    steep: 2.0,
    road: 1.5
  },
  car: {
    sidewalk: 10.0, // no puede transitar
    stairs: 10.0,
    ramp: 10.0,
    steep: 10.0,
    road: 1.0 // solo en caminos
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

  while (openSet.size > 0) {
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

    // Si llegamos al destino
    if (currentId === endId) {
      return reconstructPath(graph, cameFrom, currentId, gScore);
    }

    openSet.delete(currentId);
    const currentNode = graph.nodes.find(n => n.id === currentId)!;

    // Revisar vecinos
    const neighborEdges = graph.edges.filter(e => e.from === currentId);

    for (const edge of neighborEdges) {
      const neighborId = edge.to;
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

  // No se encontró camino
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
  const path: string[] = [];
  let currentNodeId: string | undefined = currentId;

  // Reconstruir camino hacia atrás
  while (currentNodeId) {
    path.unshift(currentNodeId);
    currentNodeId = cameFrom.get(currentNodeId);
  }

  // Obtener nodos completos
  const nodesInPath = path.map(id => graph.nodes.find(n => n.id === id)!);

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
      const edge = graph.edges.find(e => e.from === path[i - 1] && e.to === nodeId);
      if (edge) {
        switch (edge.type) {
          case 'stairs': instructions = 'Suba las escaleras'; break;
          case 'ramp': instructions = 'Tome la rampa'; break;
          case 'steep': instructions = 'Cuidado, pendiente pronunciada'; break;
          default: instructions = 'Continúe por el camino';
        }
      }
    }

    steps.push({
      nodeId,
      nodeName: node.name,
      distanceFromPrevious,
      cumulativeDistance,
      instructions
    });
  }

  return {
    path,
    totalDistance: cumulativeDistance,
    steps,
    nodes: nodesInPath
  };
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