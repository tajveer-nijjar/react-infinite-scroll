import React from "react";
import fetch from "isomorphic-fetch";
import Contact from "./contact";

class ContactList extends React.Component {
  state = {
    contacts: [],
    per: 8,
    page: 1,
    totalPages: null,
    scrolling: false
  };

  componentWillMount() {
    this.loadContacts();
    this.scrollListerer = window.addEventListener("scroll", e => {
      this.handleScroll(e);
    });
  }

  handleScroll = e => {
    const { scrolling, totalPages, page } = this.state;

    if (scrolling) return;

    if (totalPages <= page) return;

    const lastLi = document.querySelector("ol.contacts > li:last-Child");

    const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    var bottomOffset = 50;
    if (pageOffset > lastLiOffset - bottomOffset) {
      this.loadMore();
    }
  };

  loadContacts = () => {
    const { per, page, contacts } = this.state;
    const url = `https://student-example-api.herokuapp.com/v1/contacts.json?per=${per}&page=${page}`;

    fetch(url)
      .then(response => response.json())
      .then(json =>
        this.setState({
          contacts: [...contacts, ...json.contacts],
          scrolling: false,
          totalPages: json.total_pages
        })
      );
  };

  loadMore = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
        scrolling: true
      }),
      this.loadContacts
    );
  };

  render() {
    return (
      <div>
        <ol className="contacts">
          {this.state.contacts.map(contact => {
            return (
              <li key={contact.id}>
                <Contact {...contact} />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}

export default ContactList;
