export default function({ store, redirect }) {
  // If the user was not here yet
  if (!JSON.parse(localStorage.getItem("visited"))) {
    localStorage.setItem("visited", JSON.stringify(true));
    return redirect("/about");
  }
}
