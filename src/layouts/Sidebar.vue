<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <review />
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link
            :to="{ name: 'review' }"
            class="btn btn-info text-white nav-link sidebar-button"
            >Review
            <b-badge v-if="wordsToReviewCount > 0" pill variant="danger">
              {{ wordsToReviewCount }}</b-badge
            ></router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/dashboard"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Dashboard <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/lessons"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Lessons <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/words"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Words <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/difficult"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Difficult <span class="sr-only">(current)</span>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link
            active-class="active"
            to="/texts"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Texts <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/custom-quiz"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Custom Quiz <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/settings"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Settings <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            to="/annotated-texts"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Annotated Texts <span class="sr-only">(current)</span>
          </router-link>
        </li>
        <li v-if="showSandbox" class="nav-item">
          <router-link
            active-class="active"
            to="/sandbox"
            class="nav-link"
            href="#"
          >
            <span data-feather="home"></span>
            Sandbox <span class="sr-only">(current)</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import Review from "@/components/modals/quiz/Review";
import { mapGetters } from "vuex";

export default {
  components: { Review },
  computed: {
    ...mapGetters("words", ["wordsToReviewCount"]),
    showSandbox() {
      return process.env.NODE_ENV === "development";
    }
  }
};
</script>
