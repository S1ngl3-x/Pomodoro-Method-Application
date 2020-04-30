export default function({ store, redirect }) {
  // If the user is not authenticated
  if (JSON.parse(localStorage.getItem("user"))) {
    return redirect("/");
  }
}
