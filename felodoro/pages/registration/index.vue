<template>
  <div>
    <v-alert
      text
      color="purple lighten-1"
      dense
      icon="mdi-account-plus"
      prominent
      border="left"
    >
      REGISTER
      <br>
      <br>
      Only registered users can use Felodoro - time management application based on the Pomodoro technique.
    </v-alert>

    <form v-on:submit.prevent @submit="submit">

      <v-text-field
        v-model.trim="email"
        :error-messages="emailErrors"
        hint="Like example@mail.com"
        label="E-mail"
        required
        clearable
        counter="100"
        @blur="$v.email.$touch()"
        @input="userExisting = false"
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
        hint="At least 5 characters"
        counter="100"
        @click:append="show = !show"
        @blur="$v.password.$touch()"
        tabindex="2"
      ></v-text-field>

      <v-text-field
        v-model.trim="match"
        :error-messages="matchErrors"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show ? 'text' : 'password'"
        required
        clearable
        label="Confirm password"
        hint="Passwords must match"
        counter="100"
        @click:append="show = !show"
        @blur="$v.match.$touch()"
        tabindex="3"
      ></v-text-field>

      <v-btn v-show="!valid" class="mr-4" disabled>register</v-btn>
      <v-btn v-show="valid" dark color="purple lighten-1" class="mr-4"
             type="submit" label="submit" tabindex="4">
        register
      </v-btn>
      <div v-if="userExisting">
        <br>
        <v-alert type="error">
          An error while creating user occurred. Probably because email is already registered. Have you forgotten your password?
          Write me an email to <a href="mailto: abc@example.com">lipowada@fel.cvut.cz</a> and we will sort this thing out.
        </v-alert>
      </div>

      <div>
        Already have an account? <nuxt-link to="/login" tabindex="5">Log in</nuxt-link>
      </div>
    </form>
  </div>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required, email, sameAs, minLength, maxLength} from 'vuelidate/lib/validators'

  export default {
    middleware: ["first_visit", "noauthenticated"],
    mixins: [validationMixin],
    validations: {
      email: {required, email, minLength: minLength(5), maxLength: maxLength(100)},
      password: {required, minLength: minLength(5), maxLength: maxLength(100)},
      match: {required, sameAs: sameAs('password')},
    },

    data() {
      return {
        email: "",
        password: "",
        match: "",
        show: false,
        userExisting: false,
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
      matchErrors() {
        const errors = [];
        if (!this.$v.match.$dirty) return errors;
        !this.$v.match.required && errors.push("Repeated password is required");
        !this.$v.match.sameAs && errors.push("Passwords do not match");
        return errors
      },
      valid() {
        return this.$v.$anyDirty && !this.$v.$invalid && !this.userExisting;
      }
    },

    methods: {
      async submit() {
        this.$v.$touch();
        if (!this.valid) return;

        await this.createUser();
      },

      clear() {
        this.$v.$reset()
        this.email = ''
        this.password = ''
        this.match = ''
        this.userExisting = false;
      },

      async createUser() {
        const email = this.email.toLowerCase();
        const password = this.password;

        const query = `mutation CreateUser($email: String!, $password: String!){
  userCreateOne(record:{
  email: $email,
   password: $password
   }){
    recordId
    record{
    email
    date
    pomodoroTime
    breakTime
    bigBreakTime
    validationDate
    _id
    }
  }
}`;

        const result = await this.$axios.$post("/graphql", {
          query: query,
          variables: {
            email: email,
            password: password,
          },
        }).catch(reason => console.log(reason));


        if (result.errors) {
          this.userExisting = true;
        } else {
          //autologin
          localStorage.setItem('user', JSON.stringify(result.data.userCreateOne.record));
          window.location = "/";


          // await this.$router.push("/login"); // disable autologin
        }

        return result;


      },
    },
  }
</script>

<style scoped>

</style>
