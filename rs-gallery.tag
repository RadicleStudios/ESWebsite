---
---
<rs-gallery>
  <ul ref="list">
    <li ref="thumbnail" each={ item in items }>
      <img src='{ item.url }'>
    </li>
  </ul>

  <style>
    :scope { display: block }
    :scope li { display: inline-block; width: 60px; }
    :scope img { max-width: 100% }
  </style>

  this.items = [
{%- for file in site.static_files -%}
{%- if file.path contains '/assets/product-images--vnd/large/' -%}
{url: '{{ file.path }}'},
{%- endif -%}
{%- endfor -%}
  ];

  this.on('mount', function() {
    this.invalidateLayout();
    window.addEventListener('resize', this.invalidateLayout);
  });
  this.on('unmount', function() {
    window.removeEventListener('resize', this.invalidateLayout);
  });

  invalidateLayout() {
    const columnWidth = 180;
    const gutterWidth = 18;
    const gutterHeight = Math.floor(gutterWidth * 1.618);

    const windowWidth = window.innerWidth;
    const numColumns = Math.floor((windowWidth + gutterWidth) /
      (columnWidth + gutterWidth));
    var marginLeft = (windowWidth - numColumns * columnWidth - (numColumns - 1)
      * gutterWidth) / 2 - gutterWidth;
    var marginTop = -gutterHeight;

    this.refs.list.style.marginLeft = marginLeft + "px";
    this.refs.list.style.marginTop = marginTop + "px";
    this.refs.thumbnail.forEach( function(thumbnail) {
      console.log('yup');
      thumbnail.style.width = columnWidth + "px"
      thumbnail.style.marginLeft = gutterWidth + "px"
      thumbnail.style.marginTop = gutterHeight + "px"
    });
  }

</rs-gallery>
