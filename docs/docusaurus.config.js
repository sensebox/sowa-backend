// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'sensorWiki Docs',
  tagline: 'Documentation for sensorWiki API',
  url: 'https://sowa-backend.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sensebox', // Usually your GitHub org/user name.
  projectName: 'sensor-wiki-doku', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          docLayoutComponent: "@theme/DocPage",
          docItemComponent: "@theme/ApiItem" // Derived from docusaurus-theme-openapi-docs
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
    'docusaurus-plugin-openapi-docs',
      {
        id: "apiDocs",
        docsPluginId: "classic",
        config: {
          opensensemap: {
            specPath: "openapi-specs/opensensemap.yaml",
            outputDir: "docs",
          }, 
          phenomena: { // Note: phenomena key is treated as the <id> and can be used to specify an API doc instance when using CLI commands
            specPath: "openapi-specs/phenomena.yaml", // Path to designated spec file
            outputDir: "docs/Phenomena", // Output directory for generated .mdx docs
            // sidebarOptions: {
            
            // },
          },
          sensors: {
            specPath: "openapi-specs/sensors.yaml",
            outputDir: "docs/Sensors",
            // sidebarOptions: {
            //   groupPathsBy: "tag",
            // },
          },
          devices: {
            specPath: "openapi-specs/devices.yaml",
            outputDir: "docs/Devices",
            // sidebarOptions: {
            //   groupPathsBy: "tag",
            // },
          },
          domains: {
            specPath: "openapi-specs/domains.yaml",
            outputDir: "docs/Domains",
            // sidebarOptions: {
            //   groupPathsBy: "tag",
            // },
          },
          units: {
            specPath: "openapi-specs/units.yaml",
            outputDir: "docs/Units",
            // sidebarOptions: {
            //   groupPathsBy: "tag",
            // },
          },
        }
      },
    ]
  ],

  themes: ["docusaurus-theme-openapi-docs"], // Allows use of @theme/ApiItem and other components

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'sensorWiki API Docs',
        logo: {
          alt: 'Senph Logo',
          src: 'img/senph-icon.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/sensebox/sowa-backend',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'API',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/reedu-de/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/SenseBox_De',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/sensebox/sowa-backend',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // prism: {
      //   theme: darkCodeTheme,
      //   // darkTheme: darkCodeTheme,
      // },
    }),
};

module.exports = config;
