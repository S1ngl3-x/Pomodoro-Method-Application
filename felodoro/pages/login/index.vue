<template>
  <div>
    <v-alert
      text
      color="primary"
      dense
      icon="mdi-shield-lock-outline"
      border="left"
      prominent
    >
      LOGIN
      <br>
      <br>

      Only logged users can use Felodoro - time management application based on the Pomodoro technique.
    </v-alert>

    <form v-on:submit.prevent @submit="submit">


      <v-text-field
        v-model.trim="email"
        :error-messages="emailErrors"
        label="E-mail"
        hint="Like example@mail.com"
        required
        clearable
        counter="100"
        @blur="$v.email.$touch()"
        @input="invalidLogin = false"
        tabindex="1"
      ></v-text-field>


      <v-text-field
        v-model.trim="password"
        :error-messages="passwordErrors"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        required
        clearable
        label="Password"
        hint="Your password for this site"
        counter="100"
        @click:append="show = !show"
        @blur="$v.password.$touch()"
        @input="invalidLogin = false"
        tabindex="2"
      ></v-text-field>

      <v-btn v-show="!valid" class="mr-4" disabled>Login</v-btn>
      <v-btn v-show="valid" dark color="purple lighten-1" class="mr-4"
             label="submit" type="submit" tabindex="3">
        Login
      </v-btn>
      <div v-if="invalidLogin">
        <br>
        <v-alert type="error">
          Incorrect credentials.
          <br>
          Have you forgotten your password?
          Write me an email to <a href="mailto: abc@example.com">lipowada@fel.cvut.cz</a> and we will sort this thing out.
        </v-alert>
      </div>

      <div>
        New to Felodoro? <nuxt-link to="/registration" tabindex="4">Register</nuxt-link>
      </div>


    </form>


  </div>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, email, minLength, maxLength} from 'vuelidate/lib/validators'


  export default {
    middleware: ["first_visit", "noauthenticated"],
    mixins: [validationMixin],
    validations: {
      email: {required, email, minLength: minLength(5), maxLength: maxLength(100)},
      password: {required, minLength: minLength(5), maxLength: maxLength(100)},
    },

    data() {
      return {
        email: "",
        password: "",
        match: "",
        show: false,
        invalidLogin: false,
      }
    },

    computed: {
      emailErrors() {
        const errors = [];
        if (!this.$v.email.$dirty) return errors;
        !this.$v.email.email && errors.push("Must be valid e-mail (example@mail.com)");
        !this.$v.email.required && errors.push("E-mail is required");
        !this.$v.email.minLength && errors.push("E-mail must be at least 5 characters long");
        !this.$v.email.maxLength && errors.push("E-mail cannot be more than 100 characters long");
        return errors
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) return errors;
        !this.$v.password.required && errors.push("Password is required");
        !this.$v.password.minLength && errors.push("Password must be at least 5 characters long");
        !this.$v.password.maxLength && errors.push("Password cannot be more than 100 characters long");
        return errors
      },
      valid() {
        // return this.$v.$anyDirty && !this.$v.$invalid && !this.userExisting;
        return this.$v.$anyDirty && !this.$v.$invalid && !this.invalidLogin;
      }
    },

    methods: {
      async submit() {
        this.$v.$touch();
        console.log("VOLAM LOGIN")
        if (!this.valid) return;
        const user = await this.login();
        if (user){
          this.saveUser(user);
        }
      },

      async login() {
        const email = this.email.toLowerCase();
        const password = this.password;

        const query = `query Login($email: String!, $password: String!){
  login(user: {
  email: $email,
   password: $password
   }) {
    email
    date
    pomodoroTime
    breakTime
    bigBreakTime
    validationDate
    _id
  }
}`;

        const result = await this.$axios.$post("graphql", {
          query: query,
          variables: {
            email: email,
            password: password,
          },
        }).catch(reason => console.log(reason));

        if (!result.data.login){
          console.log("incorrect credentials");
          this.invalidLogin = true;
          return null;
        }

        return result.data.login;
      },

      async saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location = "/";

        // await this.$router.push("/"); // SPA redirect not working yet
      },
    },
  }
</script>

<style scoped>

</style>
