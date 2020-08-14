import { graphql, PageProps } from "gatsby"
import React, { FC } from "react"
import { PostBrief } from "../components/blog"
import Layout from "../components/layout/layout"
import SEO from "../components/seo"
import { BlogPost } from "../types/index"
import { Container } from "reactstrap"
import styles from "../scss/blog.module.scss"
import { PageHeading } from "src/components/layout"
import { FaRssSquare } from "react-icons/fa"

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
          internal {
            description
            content
          }
          title
          date
          slug
          tags {
            ...TagBadge
          }
          source {
            excerpt
          }
        }
      }
    }
  }
`

const BlogIndex: FC<PageProps<Data>> = props => {
  const { data } = props
  const title = "Blog"
  const description = "Astrid Yu's designated mind dump location"
  return (
    <Layout {...props} currentLocation="blog">
      <SEO title={title} description={description} />
      <PageHeading title={title} description={description} bgColor="#eecc8d" />
      <Container className={styles.blogContentContainer}>
        <section>
          <p className="text-right">
            <a href="https://astrid.tech/feed.xml">
              <FaRssSquare title="Subscribe to the Blog!" />
            </a>
          </p>
        </section>
        <section>
          {data.allBlogPost.edges.map(({ node: post }) => (
            <PostBrief post={post} />
          ))}
          <p className="text-center text-muted">(End of posts)</p>
        </section>
      </Container>
    </Layout>
  )
}

export default BlogIndex
