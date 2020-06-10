import { graphql, PageProps } from "gatsby"
import React from "react"
import { PostBrief } from "../components/blog"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { BlogPost } from "../types/index"

type Data = {
  allBlogPost: {
    edges: [
      {
        node: BlogPost
      }
    ]
  }
}

export const pageQuery = graphql`
  query {
    allBlogPost(sort: { fields: date, order: DESC }) {
      edges {
        node {
          title
          date
          slug
          description
          contentType
          markdown {
            excerpt
          }
          tags {
            tag {
              slug
              name
              color
              textColor
            }
          }
        }
      }
    }
  }
`

const BlogIndex = ({ data }: PageProps<Data>) => {
  return (
    <Layout>
      <SEO title="Blog" />
      {data.allBlogPost.edges.map(({ node }) => (
        <PostBrief post={node} />
      ))}
    </Layout>
  )
}

export default BlogIndex
