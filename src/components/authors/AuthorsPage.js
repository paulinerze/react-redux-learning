import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as authorActions from "../../redux/actions/authorActions";
import * as courseActions from "../../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import AuthorsList from "./AuthorList";

export function AuthorsPage({ courses, authors, actions, loading }) {
  const [redirectToAddAuthorPage, setRedirectToAddAuthorPage] = useState(false);

  useEffect(() => {
    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        alert("Loading courses failed" + error);
      });
    }

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        alert("Loading authors failed" + error);
      });
    }
  }, []);

  function handleDeleteAuthor(author) {
    const handleCheck =
      courses.filter(function(e) {
        return e.authorId === author.id;
      }).length > 0;
    console.log(handleCheck);
    if (!handleCheck) {
      toast.success("Author deleted");
      try {
        actions.deleteAuthor(author);
      } catch (error) {
        toast.error("Delete failed. " + error.message, { autoClose: false });
      }
    } else
      toast.error("Author can't be deleted because he still has course(s).");
  }

  return (
    <>
      {redirectToAddAuthorPage && <Redirect to="/author" />}
      <h2>Authors</h2>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <button
            style={{ marginBottom: 20 }}
            className="btn btn-primary add-author"
            onClick={() => setRedirectToAddAuthorPage(true)}
          >
            Add Author
          </button>
          {authors.length > 0 ? (
            <AuthorsList onDeleteClick={handleDeleteAuthor} authors={authors} />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

AuthorsPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    courses: state.courses,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorsPage);
