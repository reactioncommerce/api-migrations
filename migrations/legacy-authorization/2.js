import _ from "lodash";
import Random from "@reactioncommerce/random";

async function up({ db, progress }) {
  const legacyShopPermissions = [
    "account/invite",
    "core",
    "create-product",
    "createProduct",
    "dashboard",
    "discounts/apply",
    "media/create",
    "media/delete",
    "media/update",
    "orders",
    "order/fulfillment",
    "order/view",
    "product/admin",
    "product/archive",
    "product/clone",
    "product/create",
    "product/publish",
    "product/update",
    "reaction-accounts",
    "reaction-email",
    "reaction-templates",
    "shipping",
    "shops/create",
    "tags",
    "tags/admin",
    "tags/edit",
    "taxes/read",
    "taxes/write",
    "owner",
    "admin"
  ];

  const legacyShopPermissionMap = {
    "core": [
      "reaction:legacy:navigationTrees/update",
      "reaction:legacy:navigationTreeItems/create",
      "reaction:legacy:navigationTreeItems/delete",
      "reaction:legacy:navigationTreeItems/publish",
      "reaction:legacy:navigationTreeItems/read",
      "reaction:legacy:navigationTreeItems/update"
    ],
    "create-product": [
      "reaction:legacy:navigationTrees-drafts/read"
    ],
    "createProduct": [
      "reaction:legacy:products/update:prices",
      "reaction:legacy:products/read",
      "reaction:legacy:products/update",
      "reaction:legacy:products/create",
      "reaction:legacy:products/clone",
      "reaction:legacy:products/publish",
      "reaction:legacy:products/archive",
      "reaction:legacy:products/admin"
    ],
    "dashboard": [
      "reaction:legacy:emails/read"
    ],
    "discounts/apply": [
      "reaction:legacy:carts:/update"
    ],
    "media/create": [
      "reaction:legacy:mediaRecords/create:media"
    ],
    "media/delete" : [
      "reaction:legacy:mediaRecords/delete:media"
    ],
    "media/update": [
      "reaction:legacy:media/update",
      "reaction:legacy:mediaRecords/update:media"
    ],
    "orders": [
      "reaction:legacy:orders/capture:payment",
      "reaction:legacy:orders/approve:payment",
      "reaction:legacy:orders/read",
      "reaction:legacy:orders/refund:payment",
      "reaction:legacy:orders/cancel:item",
      "reaction:legacy:orders/update",
      "reaction:legacy:orders/move:item"
    ],
    "order/fulfillment": [
      "reaction:legacy:orders/capture:payment",
      "reaction:legacy:orders/approve:payment",
      "reaction:legacy:orders/read",
      "reaction:legacy:orders/refund:payment",
      "reaction:legacy:orders/cancel:item",
      "reaction:legacy:orders/update",
      "reaction:legacy:orders/move:item"
    ],
    "order/view": [
      "reaction:legacy:orders/read"
    ],
    "product/admin": [
      "reaction:legacy:products/update:prices",
      "reaction:legacy:products/read",
      "reaction:legacy:products/update",
      "reaction:legacy:products/create",
      "reaction:legacy:products/clone",
      "reaction:legacy:products/archive",
      "reaction:legacy:products/publish"
    ],
    "product/archive": [
      "reaction:legacy:products/archive"
    ],
    "product/clone": [
      "reaction:legacy:products/clone"
    ],
    "product/create": [
      "reaction:legacy:products/create"
    ],
    "product/publish": [
      "reaction:legacy:products/publish"
    ],
    "product/update": [
      "reaction:legacy:products/update:prices",
      "reaction:legacy:products/update"
    ],
    "reaction-email": [
      "reaction:legacy:emails/send"
    ],
    "reaction-templates": [
      "reaction:legacy:email-templates/update"
    ],
    "shipping": [
      "reaction:legacy:surcharges/delete",
      "reaction:legacy:surcharges/update",
      "reaction:legacy:surcharges/create",
      "reaction:legacy:shippingRestrictions/read",
      "reaction:legacy:shippingMethods/read",
      "reaction:legacy:shippingRestrictions/update",
      "reaction:legacy:shippingMethods/update",
      "reaction:legacy:shippingMethods/create",
      "reaction:legacy:shippingMethods/delete",
      "reaction:legacy:shippingRestrictions/create"
    ],
    "tags": [
      "reaction:legacy:tags-inactive/read"
    ],
    "tags/admin": [
      "reaction:legacy:tags/read", "reaction:legacy:tags/update"
    ],
    "tags/edit": [
      "reaction:legacy:tags/read", "reaction:legacy:tags/update"
    ],
    "taxes/read": [
      "reaction:legacy:taxes/read"
    ],
    "taxes/write": [
      "reaction:legacy:taxes/read"
    ],
    "owner": ["reaction:legacy:navigationTrees-drafts/read",
      "reaction:legacy:tags-inactive/read",
      "reaction:legacy:taxRates/create",
      "reaction:legacy:taxRates/delete",
      "reaction:legacy:taxRates/read",
      "reaction:legacy:taxRates/update",
      "reaction:legacy:surcharges/delete",
      "reaction:legacy:surcharges/update",
      "reaction:legacy:surcharges/create",
      "reaction:legacy:shippingRestrictions/read",
      "reaction:legacy:shippingMethods/read",
      "reaction:legacy:shippingRestrictions/update",
      "reaction:legacy:shippingMethods/update",
      "reaction:legacy:shippingMethods/delete",
      "reaction:legacy:shippingRestrictions/create",
      "reaction:legacy:shippingRestrictions/delete",
      "reaction:legacy:shippingMethods/create",
      "reaction:legacy:email-templates/read",
      "reaction:legacy:email-templates/update",
      "reaction:legacy:emails/read",
      "reaction:legacy:accounts/update:emails",
      "reaction:legacy:discounts/read",
      "reaction:legacy:discounts/update",
      "reaction:legacy:discounts/delete",
      "reaction:legacy:discounts/create",
      "reaction:legacy:carts:/update",
      "reaction:legacy:products/read",
      "reaction:legacy:tags/read",
      "reaction:legacy:tags/update",
      "reaction:legacy:tags/delete",
      "reaction:legacy:tags/create",
      "reaction:legacy:taxes/read",
      "reaction:legacy:shops/read",
      "reaction:legacy:shops/update",
      "reaction:legacy:shops/owner"
    ],
    "admin": ["reaction:legacy:navigationTrees-drafts/read",
      "reaction:legacy:tags-inactive/read",
      "reaction:legacy:taxRates/create",
      "reaction:legacy:taxRates/delete",
      "reaction:legacy:taxRates/read",
      "reaction:legacy:taxRates/update",
      "reaction:legacy:surcharges/delete",
      "reaction:legacy:surcharges/update",
      "reaction:legacy:surcharges/create",
      "reaction:legacy:inventory/read",
      "reaction:legacy:inventory/update",
      "reaction:legacy:fulfillment/read",
      "reaction:legacy:shippingRestrictions/read",
      "reaction:legacy:shippingMethods/read",
      "reaction:legacy:shippingRestrictions/update",
      "reaction:legacy:shippingMethods/update",
      "reaction:legacy:shippingMethods/delete",
      "reaction:legacy:shippingRestrictions/create",
      "reaction:legacy:shippingRestrictions/delete",
      "reaction:legacy:shippingMethods/create",
      "reaction:legacy:navigationTreeItems/create",
      "reaction:legacy:email-templates/read",
      "reaction:legacy:email-templates/update",
      "reaction:legacy:emails/read",
      "reaction:legacy:accounts/update:emails",
      "reaction:legacy:discounts/read",
      "reaction:legacy:discounts/update",
      "reaction:legacy:discounts/delete",
      "reaction:legacy:discounts/create",
      "reaction:legacy:carts:/update",
      "reaction:legacy:products/read",
      "reaction:legacy:tags/read",
      "reaction:legacy:tags/update",
      "reaction:legacy:tags/delete",
      "reaction:legacy:tags/create",
      "reaction:legacy:taxes/read",
      "reaction:legacy:shops/read",
      "reaction:legacy:shops/update",
      "reaction:legacy:addressValidationRules/create",
      "reaction:legacy:addressValidationRules/delete",
      "reaction:legacy:addressValidationRules/update",
      "reaction:legacy:addressValidationRules/read"
    ]
  };

  // get all groups
  const groups = await db.collection("Groups").find({}).toArray();

  if (groups && Array.isArray(groups)) {
    // loop over each group
    groups.forEach((group) => {
      const newPermissions = group.permissions;
      // loop over all permissions in a group, find legacy permissions, and update them to the new permissions
      group.permissions.forEach((permission) => {
        // if permission is in list of legacy, then update with new ones
        if (legacyShopPermissions.includes(permission)) {
          const mappedPermissionsToAdd = legacyShopPermissionMap[permission];
          newPermissions.push(mappedPermissionsToAdd);
        }
      });

      // flatten array
      const flattenedPermissions = _.flattenDeep(newPermissions);

      // remove duplicates from list
      // many legacy permissions have the same new permissions on them, we don't need duplicates
      const uniqueNewPermissions = _.uniq(flattenedPermissions);

      // filter legacy permissions from list
      const finalPermissions = uniqueNewPermissions.filter((permission) => !legacyShopPermissions.includes(permission) && permission !== null);

      // update Groups collection with new permissions
      return db.collection("Groups").updateOne({
        _id: group._id
      }, {
        $set: {
          permissions: finalPermissions
        }
      });
    });
  }

  // check to see if new `accounts-manager` and `system-manager` groups exist
  // create them if they don't
  let newGroups = [];
  if (!groups.find((group) => group.slug === "accounts-manager")) {
    const currentDate = Date();
    newGroups.push(
      {
        _id: Random.id(),
        createdAt: currentDate,
        updatedAt: currentDate,
        name: "accounts manager",
        slug: "accounts-manager",
        permissions: [
          "reaction:legacy:accounts/invite:group",
          "reaction:legacy:accounts/add:emails",
          "reaction:legacy:accounts/add:address-books",
          "reaction:legacy:accounts/create",
          "reaction:legacy:accounts/delete:emails",
          "reaction:legacy:accounts/read",
          "reaction:legacy:accounts/remove:address-books",
          "reaction:legacy:accounts/update:address-books",
          "reaction:legacy:accounts/update:currency",
          "reaction:legacy:accounts/update:language",
          "reaction:legacy:accounts/read:admin-accounts"
        ],
        shopId: null
      }
    )
  }

  if (!groups.find((group) => group.slug === "system-manager")) {
    const currentDate = Date();
    newGroups.push(
      {
        _id: Random.id(),
        createdAt: currentDate,
        updatedAt: currentDate,
        name: "system manager",
        slug: "system-manager",
        permissions: [
          "reaction:legacy:accounts/invite:group",
          "reaction:legacy:accounts/add:emails",
          "reaction:legacy:accounts/add:address-books",
          "reaction:legacy:accounts/create",
          "reaction:legacy:accounts/delete:emails",
          "reaction:legacy:accounts/read",
          "reaction:legacy:accounts/remove:address-books",
          "reaction:legacy:accounts/update:address-books",
          "reaction:legacy:accounts/update:currency",
          "reaction:legacy:accounts/update:language",
          "reaction:legacy:accounts/read:admin-accounts"
          "reaction:legacy:shops/create"
        ],
        shopId: null
      }
    )
  }

  if (newGroups.length) {
    await db.collection("Groups").insertMany(newGroups);
  }
}

export default {
  down: "impossible",
  up
};
