import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className={'sidebar'}>
        <div className="user-info">
            <div className="info-img img-fit-cover">
                <img src="person.png" alt="profile image"/> 
                <span className="info-name">alice-doe</span>
            </div>
            <nav className="navigation">
                <ul className="nav-item" key={
                    navigationLink.id
                }>
                    <a href="#" className={'nav-link'}>
                        <img src = {navigationLink.image}
                        className="nav-link-icon" alt={navigationLink.title}/>
                        <span className="nav-link-text">
                            {navigationLink.title}
                        </span>

                        
                    </a>
                </ul>
            </nav>
        </div>

    </div>
  )
}

export default Sidebar