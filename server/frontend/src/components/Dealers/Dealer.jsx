import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("dealer"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let reviews_url = root_url + `djangoapp/reviews/dealer/${id}`;
  let post_review = root_url + `postreview/${id}`;

  const get_dealer = useCallback(async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      console.log(retobj);

      if (res.status === 200) {
        setDealer(retobj.dealer);
      }
    } catch (error) {
      console.error('Error fetching dealer:', error);
    }
  }, [dealer_url]);

  const get_reviews = async () => {
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  };

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    const username = sessionStorage.getItem("username");
    if (username) {
      console.log(username);
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, [get_dealer, get_reviews, post_review, review_icon]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      {dealer ? (
        <div style={{ marginTop: "10px" }}>
          <h1 style={{ color: "grey" }}>
            {dealer.full_name}
            {postReview}
          </h1>
          <h4 style={{ color: "grey" }}>
            {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
        </div>
      ) : (
        <p>Loading dealer information...</p>
      )}
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <p>Loading Reviews....</p>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review._id}>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt="Sentiment" />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
