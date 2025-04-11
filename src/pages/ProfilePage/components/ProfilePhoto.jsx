import React from "react";
import { Image } from "react-bootstrap";

const ProfilePhoto = ({ photoURL }) => {

  return (
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block">
        <Image 
          src={photoURL || "https://via.placeholder.com/150"} 
          roundedCircle 
          width={150} 
          height={150}
          className="border border-3 border-success"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
export default ProfilePhoto;