<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar">
    <review />
    <div class="sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a
            v-b-modal.review-words-modal
            href="#"
            class="btn btn-info text-white nav-link sidebar-button"
            >Review
            <b-badge v-if="wordsToReviewCount > 0" pill variant="danger">
              {{ wordsToReviewCount }}</b-badge
            ></a
          >
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
    ...mapGetters("words", ["wordsToReviewCount"])
  }
};
</script>
