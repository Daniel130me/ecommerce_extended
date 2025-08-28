import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto py-3">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">E-Commerce App</h5>
            <p>
              This is a full-stack e-commerce application built with Node.js, Express, MongoDB, and React.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Link 1</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Link 2</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Email: info@example.com</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Phone: +123 456 7890</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © {new Date().getFullYear()} E-Commerce App
      </div>
    </footer>
  );
};

export default Footer;