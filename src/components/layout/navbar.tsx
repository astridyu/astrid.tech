import { Link } from "gatsby"
import React, { FC, ReactNode, useState, PropsWithChildren } from "react"
import { BsArrowsCollapse } from "react-icons/bs"
import { GiHamburger } from "react-icons/gi"
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavLink,
} from "reactstrap"
import "./navbar.scss"
import { BLMBanner } from "./blm"

type NavLinkProps = {
  to: string
  children: ReactNode
}

const GNavLink: FC<NavLinkProps> = ({ to, children }) => {
  return (
    <Link className={`nav-link`} to={to}>
      {children}
    </Link>
  )
}

const MainNavbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  return (
    <Navbar className="main-navbar" expand="md" fixed="top">
      <NavbarBrand tag={Link} to="/" activeClassName="active">
        Astrid's Tech
      </NavbarBrand>
      <NavbarToggler onClick={toggleIsOpen}>
        {isOpen ? <BsArrowsCollapse /> : <GiHamburger />}
      </NavbarToggler>
      <Collapse isOpen={isOpen} navbar>
        <GNavLink to="/portfolio">Portfolio</GNavLink>
        <GNavLink to="/blog">Blog</GNavLink>
        <NavLink href="https://github.com/plenglin">GitHub</NavLink>
      </Collapse>
    </Navbar>
  )
}

export default MainNavbar
