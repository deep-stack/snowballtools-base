import React from 'react'

import ProjectsSection from "../../components/dashboard/projects/ProjectsSection"
import SearchbarSection from "../../components/dashboard/projects/SearchbarSection"
import TitleSection from "../../components/dashboard/projects/TitleSection"

const Projects = () => {
  return (
    <div className='h-full flex flex-col border-solid border-2'>

      <div className='h-20 border-solid border-2'>
        <SearchbarSection/>
      </div>
      <div className='h-20 border-solid border-2'>
        <TitleSection/>
      </div>
      <div className='flex-grow border-solid border-2'>
        <ProjectsSection/>
      </div>

    </div>
  )
}

export default Projects

