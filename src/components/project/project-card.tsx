import { graphql, navigate } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import React, { FC, useRef } from "react"
import { Badge, CardBody, UncontrolledTooltip } from "reactstrap"
import { getPersistentColor, PastelTheme } from "src/util"
import { Project } from "../../types"
import { TagList } from "../tag"
import styles from "./project.module.scss"

type StatusBadgeProps = {
  status: Project["status"]
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const badgeId = useRef(null)

  let title: string, tooltip: string, color: string
  switch (status) {
    case "wip":
      title = "WIP"
      tooltip = "I am currently working on this."
      color = "info"
      break
    case "complete":
      title = "Complete"
      tooltip = "This project is complete!"
      color = "success"
      break
    case "scrapped":
      title = "Scrapped"
      tooltip = "I decided it wasn't worth pursuing anymore."
      color = "danger"
      break
    default:
      return null
  }
  return (
    <Badge ref={badgeId} color={color}>
      {title}
      <UncontrolledTooltip placement="top" target={badgeId}>
        {tooltip}
      </UncontrolledTooltip>
    </Badge>
  )
}

type ProjectCardProps = {
  project: Project
  hovered?: boolean
  onMouseEnter?: (project: Project) => void
  onMouseLeave?: (project: Project) => void
}

export const projectCardFragment = graphql`
  fragment ProjectCard on Project {
    slug
    startDate(formatString: "MMMM YYYY")
    endDate(formatString: "MMMM YYYY")
    title
    status
    internal {
      description
    }
    tags {
      ...TagBadge
    }
    url
    source
    thumbnail {
      childImageSharp {
        fluid(maxWidth: 400, maxHeight: 160) {
          ...GatsbyImageSharpFluid
        }
      }
      publicURL
    }
  }
`

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  hovered = false,
  onMouseEnter: _onEnter,
  onMouseLeave: _onLeave,
}) => {
  const className =
    (hovered ? styles.hoveredProjectCard : "") + " " + styles.projectCard
  const onEnter = () => {
    _onEnter && _onEnter(project)
  }

  const onExit = () => {
    _onLeave && _onLeave(project)
  }

  const onClickCard = (ev: React.MouseEvent<HTMLElement>) => {
    if ((ev.target as any).tagName != "A") {
      navigate(project.slug, { replace: false })
    }
  }

  const cardOuterProps = {
    onClick: onClickCard,
    onMouseEnter: onEnter,
    onMouseLeave: onExit,
    className: className,
  }

  const inner = (
    <CardBody>
      <h3 className={styles.title}>{project.title}</h3>
      <TagList tags={project.tags} limit={5} className={styles.tags} link />
    </CardBody>
  )

  const [h, s, v] = getPersistentColor(project.slug, PastelTheme)
  if (project.thumbnail && project.thumbnail.childImageSharp) {
    const stack = [
      `linear-gradient(to bottom, hsla(${h}, 80%, 100%, 0.9), hsla(${h}, 80%, 80%, 0.7), rgba(0.6, 0.6, 0.6, 0.3))`,
      (project.thumbnail as any).childImageSharp.fluid,
    ]
    return (
      <BackgroundImage
        fluid={stack}
        {...cardOuterProps}
        style={{
          backgroundColor: "clear",
        }}
      >
        {inner}
      </BackgroundImage>
    )
  } else {
    const color = `hsl(${h}, ${s}%, ${v}%)`
    return (
      <div
        {...cardOuterProps}
        style={{ backgroundColor: color, borderColor: color }}
      >
        {inner}
      </div>
    )
  }
}
