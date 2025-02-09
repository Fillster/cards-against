/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3826546831",
    "hidden": false,
    "id": "relation525882232",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "game_players_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // remove field
  collection.fields.removeById("relation525882232")

  return app.save(collection)
})
