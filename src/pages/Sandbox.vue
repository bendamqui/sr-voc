<template>
  <div class="row">
    <b-button @click="a">Parse</b-button>
    <div id="source" class="col-md-12">
      123 456 <span>xyz</span> <span>123</span>123 te test
    </div>
    <div id="target" class="col-md-12"></div>
  </div>
</template>

<script>
import { annotateNode } from "@/utils/annotations";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {},
  data: () => ({
    html: "<div>div</div>",
    debug: "a",
    error: ""
  }),
  computed: {
    ...mapGetters("annotations", ["annotations"])
  },
  created() {
    this.loadAnnotations();
  },
  mounted() {
    //this.parse();
    /*const reg = new RegExp(a.join("|"), "g");

    const string = a.join(",");
    console.log(reg);
    const matches = string.matchAll(reg);
    console.log(Array.from(matches));*/
  },
  methods: {
    ...mapActions("annotations", ["loadAnnotations"]),
    a() {
      annotateNode(this.annotations, "source");
    },
    parse() {
      const div = document.getElementById("source");
      const nodes = this.getNodeChildren(div, []).filter(this.filterTextNode);
      nodes.forEach(this.splitTextNode(this.annotations));

      this.getNodeChildren(div, [])
        .filter(this.filterTextNode)
        .filter(this.withoutSpan)
        .forEach(this.wrapMatchInSpan(this.annotations));
    },
    wrapMatchInSpan(search) {
      return node => {
        if (search.includes(node.nodeValue)) {
          const span = document.createElement("span");
          span.classList.add("blue");
          span.appendChild(document.createTextNode(node.nodeValue));
          node.replaceWith(span);
        }
      };
    },
    splitTextNode(search) {
      return node => {
        const reg = new RegExp(search.join("|"), "g");
        Array.from(node.nodeValue.matchAll(reg)).reduce(
          (acc, match) => {
            const rest = acc.node.splitText(match.index - acc.index);
            return {
              node: rest.splitText(match[0].length),
              index: match.index + match[0].length
            };
          },
          { node, index: 0 }
        );
      };
    },
    _parse() {
      /*const div = document.getElementById("source");
      const res = this.getNodeChildren(div, []);
      console.log(res.filter(node => node.nodeType === Node.TEXT_NODE));

      res.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const match = node.nodeValue.match(/456/);
          console.log(match);
          const rest = node.splitText(match.index);
          rest.splitText(match[0].length);
          console.log(rest.nodeValue);
        }
      });
      this.getNodeChildren(div, []).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          //console.log(node.nodeValue);
        }
      });
      console.log(
        this.getNodeChildren(div, []).filter(
          node => node.nodeType === Node.TEXT_NODE
        )
      );*/
      /*res.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement("h1");
          span.appendChild(document.createTextNode(" new content "));
          node.replaceWith(span);

          console.log(node.splitText(0));
        }
      });*/
    },

    getNodeChildren(node, list) {
      list.push(node);
      if (node.hasChildNodes()) {
        Array.from(node.childNodes).forEach(child => {
          return this.getNodeChildren(child, list);
        });
      }
      return list;
    },

    filterTextNode(node) {
      return node.nodeType === Node.TEXT_NODE;
    },
    withoutSpan(node) {
      while (node.parentNode && node.parentNode.id !== "source") {
        node = node.parentNode;
        if (node.tagName === "SPAN") {
          console.log("yo");
          return false;
        }
      }

      return true;
    },

    buildDomFromString() {
      const template = document.createElement("template");
      template.innerHTML = this.html;
      const target = document.getElementById("target");
      target.replaceWith(template.content.firstChild);
    }
  }
};
</script>

<style scoped>
.annotation {
  color: blue;
}
</style>
