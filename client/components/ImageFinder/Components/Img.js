import React from 'react';

const Img = props => {
  return (
    <div className="image-finder__item">
      <img
        onClick={() => props.handleImageSelection(props.url)}
        className="image-finder__image"
        src={`${props.url}&q=80&crop=faces&fit=crop&h=420&w=520`}
        alt="Unsplash Image here"
      />
    </div>);
}

export default Img;
