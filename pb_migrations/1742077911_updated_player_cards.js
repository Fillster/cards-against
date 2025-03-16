/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3962070973")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3826546831",
    "hidden": false,
    "id": "relation2196233259",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "playerId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3962070973")

  // remove field
  collection.fields.removeById("relation2196233259")

  return app.save(collection)
})
