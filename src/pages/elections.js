import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import RegionsLinks from "../components/regions_links"
import SEO from "../components/seo"
import styles from '../stylesheets/elections.module.sass'

export const query = graphql`
  query {
    allElectionsJsonData(filter: { name: { ne: null } }) {
      nodes {
        year
        name
        regions {
          name
        }
      }
    }
    flagImage: file(relativePath: { eq: "flag.png" }) {
      childImageSharp {
        fixed(width: 36) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    boxImage: file(relativePath: { eq: "box.png" }) {
      childImageSharp {
        fixed(width: 108) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

class Election {
  constructor(data) {
    this.name = data.name.replace(/\s/g, '-').toLowerCase()
    switch(data.name) {
      case '2016 Legislator Election':
        this.title = '立法委員選舉'
        break;
      case '2016 President Election':
        this.title = '總統選舉'
        break;
      default:
        data.title = data.name
    }
    this.regions = data.regions.map((region) => ({
      name: region.name,
      constituencies: (region.name === '全國' || '原住民') ? [{ 'name': '全國' }] : [{ 'name': '第01選區' }]
    }))
  }
}

const ElectionsIndexPage = ({ data }) => {
  return (
    <Layout>
      <Link to="/">{'< 返回'}</Link>
      <SEO title="選舉金流" />
      <YearsList data={ data } />
      <ElectionBlocks data={ data } />
      <Img fixed={ data.boxImage.childImageSharp.fixed }
           style={
             { 
               float: `right`
             }
           } />
    </Layout>

  )
}

export const YearsList = ({ data }) => {
  const yearsArray = data.allElectionsJsonData.nodes.map((election) => (election.year))
  const yearsList = [...new Set(yearsArray)].map((year) => (
    <li>
      <a href="#">
        { year }
      </a>
    </li>
  ))
  return (
    <div>
      <ul className={ styles.yearsList }>
        { yearsList }
      </ul>
    </div>
  )
}

export const ElectionBlocks = ({ data }) => {
  const elections = [].concat.apply([], data.allElectionsJsonData.nodes.map((election) => (new Election(election))))
  const electionBlocks = elections.map((election) => {
    return (
      <div>
        <h3 className={ styles.electionTitle }>
          <Img fixed={ data.flagImage.childImageSharp.fixed } className={ styles.decorationImage } />
          { election.title }
        </h3>
        <RegionsLinks regions={ election.regions }
                      urlPrefix={ `elections/${election.name}` } />
      </div>
    )
  })
  // <li><Link to={ `/elections/${election.name}/regions/全國/constituencies/全國` }>全國</Link></li>
  return (
    <div className={styles.electionBlocks}>
      { electionBlocks }
    </div>
  )
}


export default ElectionsIndexPage
