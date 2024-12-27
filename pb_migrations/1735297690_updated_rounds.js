/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_225224730")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_879072730",
    "hidden": false,
    "id": "relation3834632453",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "game_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3481593366",
    "hidden": false,
    "id": "relation1654212056",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "black_card_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2936669995",
    "hidden": false,
    "id": "relation1911524713",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "czar_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_225224730")

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_879072730",
    "hidden": false,
    "id": "relation3834632453",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "game_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3481593366",
    "hidden": false,
    "id": "relation1654212056",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "black_card_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2936669995",
    "hidden": false,
    "id": "relation1911524713",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "czar_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
