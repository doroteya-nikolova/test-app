import { EntityId, EntityMap } from "@ngrx/signals/entities";

/**
 * 
 * @param entities 
 * @returns map entities to entityMap
 */
export function mapEntities<Entity extends { id: string }>(entities: Entity[]) {
  return entities.reduce((map, entity) => ({ ...map, [entity.id]: entity }), {});
}

/**
 * 
 * @param entities - get entity collection
 * @returns entity Ids
 */
export function getEntityIds<Entity extends { id: string }>(entities: Entity[]): EntityId[] {
  return entities.map(entity => entity.id);
}