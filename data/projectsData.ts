interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Movie Project Demo',
    description: `一個電影資訊的練習專案，串接 API 顯示電影列表與細節，用來練習前端框架與資料串接。`,
    imgSrc: '',
    href: 'https://github.com/alex1129-coder/movie-project-demo',
  },
]

export default projectsData
