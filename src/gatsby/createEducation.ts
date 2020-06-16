import { Actions, NodeInput } from "gatsby"
import { v4 } from "uuid"
import { buildTagNode, getTagId, withContentDigest } from "./util"

type YamlClassNode = {
  name: string
  number: string
  tags: string[]
  desc?: string
}

type ClassNodeArg = NodeInput & {
  name: string
  number: string
  tags___NODE: string[]
  desc: string | null
}

type YamlEducationNode = NodeInput & {
  name: string
  slug: string
  degree?: string
  classes: YamlClassNode[]
}

type EducationNodeArg = NodeInput & {}

export function createCourseTagNode(
  actions: Actions,
  slug: string,
  classNode: any
) {
  const { createNode, createParentChildLink } = actions
  const tagNode = buildTagNode({
    parent: classNode.id,
    name: classNode.name,
    slug,
    color: "#18b21b",
    textColor: "#ffffff",
  })
  createNode(tagNode)
  createParentChildLink(classNode, tagNode as any)

  return tagNode
}

function createCourseNode(
  actions: Actions,
  parentSlug: string,
  parentId: string,
  yamlNode: any
) {
  const { createNode } = actions

  const slug =
    parentSlug + yamlNode.number.replace(" ", "-").toLowerCase() + "/"

  const classNode = withContentDigest({
    parent: parentId,
    internal: {
      type: "Course",
    },
    id: v4(),

    name: yamlNode.name,
    slug: slug,
    number: yamlNode.number,
    desc: yamlNode.desc ? yamlNode.desc : null,
    tags___NODE: yamlNode.tags.map(getTagId),
  })

  createNode(classNode)

  return classNode
}

export function createEducationNode(actions: Actions, yamlNode: any) {
  const { createNode, createParentChildLink } = actions

  const id = v4()
  const slug = "/education/" + yamlNode.slug + "/"

  // const classNodes = yamlNode.classes.map((raw: any) =>
  //   createClassNode(actions, slug, id, raw)
  // )

  const educationNode = withContentDigest({
    parent: yamlNode.id,
    internal: {
      type: "Education",
    },
    children: [],
    id,

    name: yamlNode.name,
    degree: yamlNode.degree,
    slug: slug,
    //courses___NODE: classNodes.map((classNode: any) => classNode.id),
  })
  console.log(educationNode)
  createNode(educationNode)
  createParentChildLink(yamlNode, educationNode as any)

  return educationNode
}
