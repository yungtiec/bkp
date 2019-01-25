import React from 'react';
import Img from './Img';
import NoImgs from './NoImgs';

const ImgList = props => {
  const results = props.data;
  let imgs;
  if (results && results.length > 0) {
    imgs = results.map(img =>
      <Img
        url={img.urls.raw}
        user={img.user.links.html}
        name={img.user.name}
        link={img.links.html}
        key={img.id}
        {...props}
      />
    );
  } else {
    imgs = <NoImgs />;
  }
  return (
    <div className="img-list">
      <div className="img-container">
        {imgs}
      </div>
    </div>
  );
};

export default ImgList;
