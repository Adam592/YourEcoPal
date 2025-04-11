import { BsArrowRight } from 'react-icons/bs';

const DashboardPage = ({ setActiveComponent }) => {
    
    return (
    <div className="container-fluid p-3" style={{ backgroundColor: '#e8f5e9' }}>
      <div className="mb-4">
        <h2 className="text-success fw-bold">Welcome to your Dashboard Page</h2>
      </div>
      
      {/* Save your water card */}
      <div className="card mb-3 border-success">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title text-success fw-bold">Save your water</h5>
              <div className="border-top border-success mb-2" style={{ width: '90%' }}></div>
              <p className="card-text text-secondary">
                Track your water usage and set timers for daily activities
              </p>
            </div>
            <button
              onClick={() => setActiveComponent('water')}
              className="btn btn-success rounded-circle"
            >
              <BsArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scan your products card */}
      <div className="card mb-3 border-success">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title text-success fw-bold">Scan your products</h5>
              <div className="border-top border-success mb-2" style={{ width: '90%' }}></div>
              <p className="card-text text-secondary">
                Check eco-friendliness and find sustainable alternatives
              </p>
            </div>
            <button
              onClick={() => setActiveComponent('qrscanner')}
              className="btn btn-success rounded-circle"
            >
              <BsArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Track your journeys card */}
      <div className="card mb-3 border-success">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title text-success fw-bold">Track your journeys</h5>
              <div className="border-top border-success mb-2" style={{ width: '90%' }}></div>
              <p className="card-text text-secondary">
                Log your travel methods and reduce your carbon footprint
              </p>
            </div>
            <button
              onClick={() => setActiveComponent('activity')}
              className="btn btn-success rounded-circle"
            >
              <BsArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* View your profile card */}
      <div className="card mb-3 border-success">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title text-success fw-bold">View your profile</h5>
              <div className="border-top border-success mb-2" style={{ width: '90%' }}></div>
              <p className="card-text text-secondary">
                Check stats and achievements
              </p>
            </div>
            <button
              onClick={() => setActiveComponent('profile')}
              className="btn btn-success rounded-circle"
            >
              <BsArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Tip of the day */}
      <div className="alert alert-success mb-2 p-2 text-center">
        <strong>TIP OF THE DAY:</strong> Turn off the tap while brushing your teeth!
      </div>
    </div>
  );
};
export default DashboardPage;