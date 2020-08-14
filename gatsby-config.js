require("source-map-support").install()
require("ts-node").register()

const fs = require("fs")

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/package.json`))

module.exports = {
  siteMetadata: {
    title: "astrid.tech",
    package: packageJson,
    version: packageJson.version,
    cookiePolicyVersion: "1",
    author: {
      name: `Astrid A. Yu`,
      summary: `who likes to engineer awesome things`,
      pronouns: {
        subj: `she`,
        obj: `her`,
        pos: `hers`,
        posAdj: `her`,
        reflex: `herself`,
      },
    },
    description: packageJson.description,
    siteUrl: packageJson.homepage,
    social: {
      twitter: `none`,
      github: `Plenglin`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/projects`,
        name: `projects`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/work`,
        name: `work`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/tags`,
        name: `tags`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/misc`,
        name: `misc-data`,
      },
    },
    `gatsby-transformer-ipynb`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          "gatsby-remark-katex",
          "gatsby-remark-graphviz",
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              isIconAfterHeader: true,
              className: "header-link",
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
          `@pauliescanlon/gatsby-remark-sticky-table`,
          `gatsby-remark-copy-linked-files`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-171109022-1`,
      },
    },
    {
      resolve: `gatsby-plugin-build-date`,
      options: {
        formatAsDateString: true,
        formatting: {
          format: "HH:MM:SS dddd D MMMM YYYY",
          utc: true,
        },
      },
    },
    //`gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `assets/astrid-tech-icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `astridtech`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }

          allSitePage {
            nodes {
              path
            }
          }
        }`,
        resolveSiteUrl: ({ site }) => {
          return site.siteMetadata.siteUrl
        },
        serialize: ({ site, allSitePage }) =>
          allSitePage.nodes.map(node => {
            const url = `${site.siteMetadata.siteUrl}${node.path}`
            if (node.path == "/")
              return {
                url,
                changefreq: "monthly",
                priority: 1.0,
              }
            if (node.path == "/projects/")
              return {
                url,
                changefreq: "weekly",
                priority: 0.9,
              }
            if (node.path == "/about/")
              return {
                url,
                changefreq: "monthly",
                priority: 0.7,
              }
            if (node.path == "/privacy/")
              return {
                url,
                changefreq: "weekly",
                priority: 0.1,
              }
            if (/\/projects\/.+/.test(node.path))
              return {
                url,
                changefreq: "weekly",
                priority: 0.6,
              }
            if (node.path == "/blog/")
              return {
                url,
                changefreq: "daily",
                priority: 0.8,
              }
            if (/\/blog\/.+/.test(node.path))
              return {
                url,
                changefreq: "weekly",
                priority: 0.6,
              }
            return {
              url,
              changefreq: "monthly",
              priority: 0.6,
            }
          }),
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://astrid.tech",
        sitemap: "https://astrid.tech/sitemap.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    `gatsby-source-local-git`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        includePaths: [__dirname],
      },
    },
    "gatsby-source-license",
    "gatsby-plugin-root-import",

    "gatsby-astrid-source-lang-tags",

    "gatsby-astrid-transformer-user-tags",
    "gatsby-astrid-transformer-skills",

    "gatsby-astrid-transformer-work",
    "gatsby-astrid-transformer-education",

    "gatsby-astrid-transformer-notebook-markdown",
    "gatsby-astrid-transformer-markdown-post",
    "gatsby-astrid-transformer-project",

    "gatsby-astrid-plugin-blog",
    "gatsby-astrid-plugin-tagging",
  ],
}
