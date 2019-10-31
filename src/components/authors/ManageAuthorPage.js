import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadAuthors, saveAuthor } from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import AuthorForm from "./AuthorForm";
import { newAuthor } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

export function ManageAuthorPage({
  authors,
  loadAuthors,
  saveAuthor,
  history,
  loading,
  ...props
}) {
  const [author, setAuthor] = useState({ ...props.author });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert("Loading authors failed" + error);
      });
    }
  }, [props.author]);

  function handleChange(event) {
    const { name, value } = event.target;
    setAuthor(prevAuthor => ({
      ...prevAuthor,
      [name]: value
    }));
  }

  function formIsValid() {
    const { name } = author;
    const errors = {};

    if (!name) errors.name = "Name is required.";

    setErrors(errors);
    // Form is valid if the errors object still has no properties
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    saveAuthor(author)
      .then(() => {
        toast.success("Author saved.");
        history.push("/authors");
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  return authors.length === 0 && loading ? (
    <Spinner />
  ) : (
    <AuthorForm
      author={author}
      errors={errors}
      onChange={handleChange}
      onSave={handleSave}
      saving={saving}
    />
  );
}

ManageAuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveAuthor: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

export function getAuthorBySlug(courses, slug) {
  return courses.find(author => author.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const author =
    slug && state.courses.length > 0
      ? getAuthorBySlug(state.author, slug)
      : newAuthor;
  return {
    author,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  loadAuthors,
  saveAuthor
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAuthorPage);
