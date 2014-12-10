define(["modules/graphs/module","chartjs"],function(a){"use strict";return a.registerDirective("chartjsPieChart",function(){return{restrict:"A",link:function(a,b){{var c={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,responsive:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'},d=[{value:300,color:"rgba(220,220,220,0.9)",highlight:"rgba(220,220,220,0.8)",label:"Grey"},{value:50,color:"rgba(151,187,205,1)",highlight:"rgba(151,187,205,0.8)",label:"Blue"},{value:100,color:"rgba(169, 3, 41, 0.7)",highlight:"rgba(169, 3, 41, 0.7)",label:"Red"}],e=b[0].getContext("2d");new Chart(e).Pie(d,c)}}}})});