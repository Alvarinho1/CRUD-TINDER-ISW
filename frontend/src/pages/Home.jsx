import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <>
      <Navbar />
        <div className='main-container'>
          {JSON.parse(sessionStorage.getItem("usuario")).nombre}
      </div>
    </>
  )
}

export default Home
