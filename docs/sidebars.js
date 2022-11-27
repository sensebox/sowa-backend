/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  tutorialSidebar: [
    'intro',
    'sign-in-opensensemap',
    {
      type: 'category',
      label: 'Phenomena',
      items: [
        {
          type: 'doc',
          label: 'Get all phenomena',
          id: 'Phenomena/get-all-phenomena',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Get a single phenomenon',
          id: 'Phenomena/get-single-phenomenon',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Create a new phenomenon',
          id: 'Phenomena/create-new-phenomenon',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Edit a phenomenon',
          id: 'Phenomena/edit-phenomenon',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Delete a phenomenon',
          id: 'Phenomena/delete-phenomenon',
          className: 'post api-method',
        },
      ],
    },
    {
      type: 'category',
      label: 'Sensors',
      items: [
        {
          type: 'doc',
          label: 'Get all sensors',
          id: 'Sensors/get-all-sensors',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Get a single sensor',
          id: 'Sensors/get-single-sensor',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Create a new sensor',
          id: 'Sensors/create-new-sensor',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Edit a sensor',
          id: 'Sensors/edit-sensor',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Delete a sensor',
          id: 'Sensors/delete-sensor',
          className: 'post api-method',
        },
      ],
    },
    {
      type: 'category',
      label: 'Devices',
      items: [
        {
          type: 'doc',
          label: 'Get all devices',
          id: 'Devices/get-all-devices',
          className: 'get api-method', 
        },
        {
          type: 'doc',
          label: 'Get a single device',
          id: 'Devices/get-single-device',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Get all sensors of a device',
          id: 'Devices/get-device-sensors',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Create a new device',
          id: 'Devices/create-new-device',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Edit a device',
          id: 'Devices/edit-device',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Delete a device',
          id: 'Devices/delete-device',
          className: 'post api-method',
        },
      ],
    },
    {
      type: 'category',
      label: 'Domains',
      items: [
        {
          type: 'doc',
          label: 'Get all domains',
          id: 'Domains/get-all-domains',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Get a single domain',
          id: 'Domains/get-single-domain',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Create a new domain',
          id: 'Domains/create-new-domain',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Edit a domain',
          id: 'Domains/edit-domain',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Delete a domain',
          id: 'Domains/delete-domain',
          className: 'post api-method',
        },
      ],
    },
    {
      type: 'category',
      label: 'Units',
      items: [
        {
          type: 'doc',
          label: 'Get all units',
          id: 'Units/get-all-units',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Get a single unit',
          id: 'Units/get-single-unit',
          className: 'get api-method',
        },
        {
          type: 'doc',
          label: 'Create a new unit',
          id: 'Units/create-new-unit',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Edit a unit',
          id: 'Units/edit-unit',
          className: 'post api-method',
        },
        {
          type: 'doc',
          label: 'Delete a unit',
          id: 'Units/delete-unit',
          className: 'post api-method',
        },
      ],
    },
  ],
};

module.exports = sidebars;
