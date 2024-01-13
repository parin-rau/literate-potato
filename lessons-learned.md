# Lessons Learned

# Motivations

-   Wanted to build a more complex full-stack app on my own after following along with basic tutorials on YouTube/Udemy to get started with web dev.
-   Not satisfied with previous project management tools I've tried for managing my own work tasks and projects (Notion, Jira, spreadsheets, writing checklists on paper)

# Possible Improvements

## General

-   Clearly define scope of project, basic design docs from the beginning and don't start programming until requirements are defined
-   Implement automated testing for:
    -   API routes
    -   utility/helper functions

## Back End

-   Consider writing backend in Java/C#/Python to get more diverse experience
-   Define data types before implementing backend
-   Use schemas for database access and better type safety
-   Commit to a DB technology from the beginning (i.e. use Postgres from the beginning instead of trying to switch from MongoDB halfway through the project)
-   Modularize backend more to avoid copy/paste boiler plate for many routes
    -   lots of routes could be simplified to take parameters in url instead of matching specific strings
-   Define basic types/interfaces/classes to derive others from (i.e. ticket, project inherit from generic resource class)
-   Consider off-the-shelf auth for simplicity
-   Use different status codes for indicating to refresh JWT vs. indicating unauthorized access with incorrect credentials
    -   Overlap between 4xx codes caused issues with unexpected sign-outs during development

## Front End

-   Create button/input components to use everywhere to avoid redoing styling and passing same kinds of functions many times
-   Use more generic components to avoid recreating similar types of components multiple times
-   Put all helper functions into hooks to keep main jsx files cleaner
-   Consider Redux or similar state management solution
-   Consider useReducer instead of useState for complex object state
-   Avoid useEffect as much as possible because of unexpected side effects
-   Consider moving away from ReactRouter because of iffy documentation/online support

# Positives

-   Project manager is usable for tracking progress of my upcoming personal project ideas
-   Built a functional full-stack app from scratch
-   Learned basics of auth, JWTs, REST APIs
-   Getting hands dirty with backend dev process
-   Deep dive into React
