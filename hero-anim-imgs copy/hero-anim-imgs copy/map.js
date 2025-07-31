(function () {
         // Ensure mapData.js is loaded
         if (!window.ids || !window.data1 || !window.stateDetails) {
            console.error('mapData.js not loaded!');
            return;
         }

         // Utility functions
         function capitalize(str) {
            return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
         }

         // Tooltip logic
         let tooltip, tooltipBg;

         function showTooltip(evt, text) {
            const target = evt.target;
            const svg = target.ownerSVGElement;
            const bbox = target.getBBox();

            // Position tooltip to the right and vertically centered
            const x = bbox.x + bbox.width + 12;
            const y = bbox.y + bbox.height / 2;

            tooltip.textContent = text;
            tooltip.setAttribute('x', x);
            tooltip.setAttribute('y', y);
            tooltip.setAttribute('visibility', 'visible');

            const textLen = tooltip.getComputedTextLength();
            tooltipBg.setAttribute('width', textLen + 20);
            tooltipBg.setAttribute('x', x - 10);
            tooltipBg.setAttribute('y', y - 18);
            tooltipBg.setAttribute('visibility', 'visible');

            // Move tooltip elements to top of SVG
            svg.appendChild(tooltipBg);
            svg.appendChild(tooltip);
         }

         function hideTooltip() {
            tooltip.setAttribute('visibility', 'hidden');
            tooltipBg.setAttribute('visibility', 'hidden');
         }

         // Details box logic
         function showStateDetails(stateEl) {
            const box = document.getElementById('state-details-box');
            const stateName = stateEl.getAttribute('title');
            const details = window.stateDetails[stateName];
            let html = '<button class="close-btn" onclick="this.parentNode.style.display=\'none\'">&times;</button>';
            html += `<h2>${stateName}</h2>`;
            if (details && typeof details === 'object') {
               Object.entries(details).forEach(([key, value]) => {
                  html += `<div class="details-row"><span>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span> <span>${value}</span></div>`;
               });
            } else {
               html += '<div class="details-row">No details available.</div>';
            }
            box.innerHTML = html;
            box.style.display = 'block';
         }

         function hideStateDetails() {
            const box = document.getElementById('state-details-box');
            if (box) box.style.display = 'none';
         }

         // Highlight logic
         function clearHighlights() {
            window.ids.forEach(id => {
               const el = document.getElementById(id);
               if (el) {
                  el.classList.remove('state-hover', 'state-popout', 'state-dim');
               }
            });
            hideStateDetails();
         }

         function highlightState(stateEl) {
            // Clear highlights first
            const prev = document.querySelector('.map .state-popout');
            if (prev && prev !== stateEl) {
               prev.classList.remove('state-popout', 'state-hover');
               prev.style.zIndex = '';
            }

            // Dim all states
            window.ids.forEach(id => {
               const el = document.getElementById(id);
               if (el && el !== stateEl) {
                  el.classList.add('state-dim');
                  el.style.zIndex = '';
               }
            });

            // Now highlight selected state
            stateEl.classList.add('state-popout', 'state-hover');
            stateEl.classList.remove('state-dim');
            stateEl.style.zIndex = '10';

            // 🔥 Always show details after highlighting
            showStateDetails(stateEl);
         }
         // Initial coloring (from data1)
         function colourCountries(dataGroups) {
            const colors = [
               '#e74c3c', // Red
               '#f1c40f', // Yellow
               '#3498db', // Blue
               '#9b59b6', // Purple
               '#16a085'  // Green

            ];
            dataGroups.forEach((group, i) => {
               group.forEach(id => {
                  const el = document.getElementById(id);
                  if (el) el.style.fill = colors[i % colors.length];
               });
            });
         }

         // Main initialization
         function initSVGMap() {
            // Get tooltip elements
            tooltip = document.getElementById('tooltip');
            tooltipBg = document.getElementById('tooltip_bg');

            // Attach event listeners to each state
            window.ids.forEach(id => {
               const el = document.getElementById(id);
               if (!el) return;

               // Mouseover: show tooltip
               el.addEventListener('mouseover', e => {
                  el.classList.add('state-hover');
                  showTooltip(e, capitalize(el.getAttribute('title')));
               });

               // Mouseout: hide tooltip
               el.addEventListener('mouseout', e => {
                  el.classList.remove('state-hover');
                  hideTooltip();
               });

               // Click: highlight and show details
               el.addEventListener('click', e => {
                  highlightState(el);
                  // Move tooltip elements above
                  const svg = el.ownerSVGElement;
                  if (svg) {
                     svg.appendChild(tooltipBg);
                     svg.appendChild(tooltip);
                  }
               });
            });

            // Click on SVG background: reset highlights
            const svgEl = document.querySelector('.map svg');
            if (svgEl) {
               svgEl.addEventListener('mousedown', e => {
                  // Only reset if not clicking a state
                  if (!(e.target.tagName === 'path' && window.ids.includes(e.target.id))) {
                     clearHighlights();
                  }
               });
            }

            // Click outside SVG: reset highlights
            document.addEventListener('mousedown', e => {
               const svgEl = document.querySelector('.map svg');
               if (svgEl && !svgEl.contains(e.target)) {
                  clearHighlights();
               }
            });

            // Initial coloring
            colourCountries(window.data1);
         }

         // SVG onload handler
         window.init = function (evt) {
            // Wait for DOMContentLoaded if needed
            if (document.readyState === 'loading') {
               document.addEventListener('DOMContentLoaded', initSVGMap);
            } else {
               initSVGMap();
            }
         };



         if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSVGMap);
         } else {
            initSVGMap();
         }
      })();