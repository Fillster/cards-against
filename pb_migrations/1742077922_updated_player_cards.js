/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3962070973")

  // remove field
  collection.fields.removeById("relation2582050271")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3962070973")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2936669995",
    "hidden": false,
    "id": "relation2582050271",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "player_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
