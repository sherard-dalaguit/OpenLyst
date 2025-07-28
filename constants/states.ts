import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message: "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const EMPTY_JOB = {
  title: "No Jobs Found!",
  message: "The job board is either empty or you typed a silly query. Maybe try again later?",
  button: {
    text: "Return to Home",
    href: ROUTES.HOME,
  },
};

export const EMPTY_BOOKMARK = {
  title: "Bookmark Collections Are Empty",
  message: "Looks like you haven’t created saved any jobs yet.",
  button: {
    text: "Save to Collection",
    href: ROUTES.SAVED_JOBS,
  },
};