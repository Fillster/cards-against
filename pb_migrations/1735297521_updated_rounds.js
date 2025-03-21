/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_225224730")

  // remove field
  collection.fields.removeById("relation1911524713")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_225224730")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
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
