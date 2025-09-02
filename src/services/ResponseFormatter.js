class ResponseFormatter {
  constructor() {
    this.templates = {
      career_card: this.getCareerCardTemplate(),
      skills_gap: this.getSkillsGapTemplate(),
      roadmap: this.getRoadmapTemplate(),
      resources: this.getResourcesTemplate()
    };
  }

  format({ message, recommendations, sessionId, contextUsed, isCareerQuery }) {
    const response = {
      message: message,
      recommendations: recommendations || [],
      html_snippet: this.generateHtmlSnippet(recommendations, isCareerQuery),
      meta: {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        context_used: contextUsed || []
      }
    };

    return response;
  }

  generateHtmlSnippet(recommendations, isCareerQuery) {
    if (!recommendations || recommendations.length === 0) {
      return this.generateChatOnlyHtml();
    }

    return this.generateCareerRecommendationsHtml(recommendations);
  }

  generateChatOnlyHtml() {
    return `<section class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <div class="flex items-center space-x-2 mb-3">
    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </div>
    <h3 class="text-sm font-medium text-gray-900">SkillMentor AI</h3>
  </div>
  <p class="text-sm text-gray-600">I'm here to help with your career questions. Feel free to ask about skills, career paths, or learning recommendations!</p>
</section>`;
  }

  generateCareerRecommendationsHtml(recommendations) {
    const careerCards = recommendations.map(rec => this.generateCareerCard(rec)).join('');
    
    return `<section class="space-y-4">
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
    <h2 class="text-lg font-semibold text-gray-900 mb-2">🎯 Career Recommendations</h2>
    <p class="text-sm text-gray-600">Based on your profile, here are personalized career paths that match your skills and interests:</p>
  </div>
  
  <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
    ${careerCards}
  </div>
</section>`;
  }

  generateCareerCard(recommendation) {
    const skillsHtml = this.generateSkillsHtml(recommendation.required_skills);
    const resourcesHtml = this.generateResourcesHtml(recommendation.learning_resources);
    const roadmapHtml = this.generateRoadmapHtml(recommendation.roadmap);
    
    return `<div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
  <div class="p-4">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-900">${recommendation.career_name}</h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ${recommendation.market_demand}
      </span>
    </div>
    
    <p class="text-sm text-gray-600 mb-3">${recommendation.reasoning}</p>
    
    <div class="mb-4">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium text-gray-700">Salary Range</span>
        <span class="text-green-600 font-semibold">${recommendation.estimated_salary_range}</span>
      </div>
    </div>
    
    ${skillsHtml}
    
    <div class="mt-4 space-y-3">
      <details class="group">
        <summary class="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          <span>📚 Learning Resources</span>
          <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </summary>
        <div class="mt-2 pl-4">
          ${resourcesHtml}
        </div>
      </details>
      
      <details class="group">
        <summary class="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          <span>🗺️ Learning Roadmap</span>
          <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </summary>
        <div class="mt-2 pl-4">
          ${roadmapHtml}
        </div>
      </details>
    </div>
  </div>
</div>`;
  }

  generateSkillsHtml(requiredSkills) {
    const mustHaveHtml = requiredSkills.must_have.map(skill => 
      `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">${skill}</span>`
    ).join('');
    
    const goodToHaveHtml = requiredSkills.good_to_have.map(skill => 
      `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">${skill}</span>`
    ).join('');
    
    return `<div class="space-y-2">
  <div>
    <h4 class="text-xs font-medium text-gray-700 mb-1">Must Have Skills</h4>
    <div class="flex flex-wrap gap-1">
      ${mustHaveHtml}
    </div>
  </div>
  <div>
    <h4 class="text-xs font-medium text-gray-700 mb-1">Good to Have Skills</h4>
    <div class="flex flex-wrap gap-1">
      ${goodToHaveHtml}
    </div>
  </div>
</div>`;
  }

  generateResourcesHtml(resources) {
    if (!resources || resources.length === 0) {
      return '<p class="text-xs text-gray-500">No specific resources available</p>';
    }
    
    return resources.map(resource => `
      <div class="flex items-start space-x-2 py-1">
        <div class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
        <div class="flex-1 min-w-0">
          <a href="${resource.link}" target="_blank" rel="noopener noreferrer" 
             class="text-xs text-blue-600 hover:text-blue-800 font-medium">
            ${resource.course_name}
          </a>
          <p class="text-xs text-gray-500">${resource.platform} • ${resource.duration}</p>
        </div>
      </div>
    `).join('');
  }

  generateRoadmapHtml(roadmap) {
    if (!roadmap) {
      return '<p class="text-xs text-gray-500">No roadmap available</p>';
    }
    
    const periods = [
      { key: '30_days', label: '30 Days', color: 'green' },
      { key: '60_days', label: '60 Days', color: 'blue' },
      { key: '90_days', label: '90 Days', color: 'purple' }
    ];
    
    return periods.map(period => {
      const tasks = roadmap[period.key] || [];
      if (tasks.length === 0) return '';
      
      return `
        <div class="mb-3">
          <h5 class="text-xs font-medium text-${period.color}-700 mb-1">${period.label}</h5>
          <ul class="space-y-1">
            ${tasks.map(task => `
              <li class="flex items-start space-x-2">
                <div class="flex-shrink-0 w-1.5 h-1.5 bg-${period.color}-400 rounded-full mt-1.5"></div>
                <span class="text-xs text-gray-600">${task}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  getCareerCardTemplate() {
    return `<div class="career-card bg-white rounded-lg shadow-sm border">
  <div class="p-4">
    <h3 class="font-semibold text-gray-900">{{career_name}}</h3>
    <p class="text-sm text-gray-600 mt-1">{{reasoning}}</p>
    <div class="mt-3 flex justify-between text-sm">
      <span class="text-green-600 font-medium">{{salary_range}}</span>
      <span class="text-blue-600">{{market_demand}}</span>
    </div>
  </div>
</div>`;
  }

  getSkillsGapTemplate() {
    return `<div class="skills-gap">
  <h4 class="text-sm font-medium text-gray-700">Skills to Develop</h4>
  <div class="mt-2 flex flex-wrap gap-1">
    {{#each missing_skills}}
    <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">{{this}}</span>
    {{/each}}
  </div>
</div>`;
  }

  getRoadmapTemplate() {
    return `<div class="roadmap space-y-3">
  <div class="roadmap-period">
    <h5 class="text-xs font-medium text-green-700">30 Days</h5>
    <ul class="mt-1 text-xs text-gray-600 space-y-1">
      {{#each 30_days}}
      <li>• {{this}}</li>
      {{/each}}
    </ul>
  </div>
</div>`;
  }

  getResourcesTemplate() {
    return `<div class="resources space-y-2">
  {{#each learning_resources}}
  <div class="resource-item">
    <a href="{{link}}" class="text-sm text-blue-600 hover:text-blue-800">{{course_name}}</a>
    <p class="text-xs text-gray-500">{{platform}} • {{duration}}</p>
  </div>
  {{/each}}
</div>`;
  }
}

module.exports = ResponseFormatter;