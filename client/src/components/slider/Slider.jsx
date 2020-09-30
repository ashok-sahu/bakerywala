import React, { useState } from "react";
import { Carousel } from "react-bootstrap";

const Slider = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 "
          src={require("../../assets/images/c-1.jpg")}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3 className='animated bounceInRight brgt'>First slide label</h3>
          <p className='animated bounceInLeft blt' >Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 "
          src={require("../../assets/images/c-2.jpg")}
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3 className='animated bounceInRight brgt'>Second slide label</h3>
          <p className='animated bounceInLeft blt' >Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 "
          src={require("../../assets/images/c-3.jpg")}
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3 className='animated bounceInRight brgt'>Third slide label</h3>
          <p className='animated bounceInLeft blt' >
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
