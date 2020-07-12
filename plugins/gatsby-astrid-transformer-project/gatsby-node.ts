import { GatsbyNode, Node, SourceNodesArgs } from "gatsby"
import { createFilePath, FileSystemNode } from "gatsby-source-filesystem"
import { v4 } from "uuid"
import { withContentDigest } from "../util"
import { resolveFileNode } from "../util/index"

type MarkdownNode = Node & {
  frontmatter: ProjectMetadata
  excerpt: string
}

type ProjectMetadata = {
  title: string
  status: string
  startDate: Date
  endDate: Date
  description: string
  url: string
  source: string
  tags: string[]
  thumbnail: string | null
}

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions,
  schema,
}: SourceNodesArgs) => {
  const { createTypes } = actions

  const Project = schema.buildObjectType({
    name: "Project",
    fields: {
      id: "String!",
      title: "String!",
      status: "String!",
      startDate: "Date!",
      endDate: "Date",
      url: "String",
      source: "String",
      thumbnail: "File",
      tagSlugs: "[String]",
      tags: { type: "[Tag]", extensions: { tagify: {} } },
    },
    interfaces: ["Tagged", "Node"],
  })

  createTypes([Project])
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  node,
  actions,
  getNode,
  getNodesByType,
  loadNodeContent,
}) => {
  if (node.internal.type != "MarkdownRemark") return
  const markdownNode = (node as unknown) as MarkdownNode

  const parentFileSystem = getNode(markdownNode.parent) as FileSystemNode
  if (parentFileSystem.sourceInstanceName != "projects") return

  const { createNode, createParentChildLink } = actions
  const slug = createFilePath({ node, getNode })

  const frontmatter = markdownNode.frontmatter
  var thumbnailFileNodeId = null
  if (frontmatter.thumbnail) {
    const fileNode = getNode(markdownNode.parent) as FileSystemNode
    const file = resolveFileNode({
      file: fileNode,
      relativePath: frontmatter.thumbnail,
      getNodesByType,
    })
    thumbnailFileNodeId = file?.id ?? null
  }

  const postNode = withContentDigest({
    parent: markdownNode.id,
    internal: {
      type: `Project`,
      content: await loadNodeContent(markdownNode),
      mediaType: "text/html",
    } as any,
    id: v4(),
    children: [],

    slug: slug,
    title: frontmatter.title,
    startDate: frontmatter.startDate,
    endDate: frontmatter.endDate,
    thumbnail___NODE: thumbnailFileNodeId,
    tagSlugs: markdownNode.frontmatter.tags,
  })

  createNode(postNode)
  createParentChildLink({ parent: markdownNode, child: postNode })
}
