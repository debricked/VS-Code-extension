## Prerequisites for merge, code author responsibilities
* [ ] I as the code author have ensured that acceptance criteria is met
* [ ] I as the code author have self-reviewed code and functionality
* [ ] I have added new tests/extended existing ones
* [ ] If this contains frontend changes, a design review has been requested and completed
* [ ] A security review is initialized according to Security Chapter Policy

## Prerequisites for merge, reviewer responsibilities
* [ ] I as the reviewer have ensured that acceptance criteria is met
* [ ] Code has been reviewed
* [ ] Ensured the right tests have been added
* [ ] Manual testing has been performed

## Description of changes
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context.

Fixes # (issue)

## Type of change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration.

### Unit Tests
These are tests that validate the functionality of a specific section of code, usually at the function level.

- [ ] Test A: Description of unit test A (e.g., "Test to verify that the input validation function correctly identifies invalid inputs")
- [ ] Test B: Description of unit test B (e.g., "Test to ensure the output formatting function produces the correct format for given inputs")

### Integration Tests
These tests verify the interaction between different pieces of code to ensure they work together as expected.

- [ ] Test C: Description of integration test C (e.g., "Test to check that the integration between the data processing module and the database module works correctly")
- [ ] Test D: Description of integration test D (e.g., "Test to verify that the API endpoint correctly integrates with the authentication module")

### End-to-End Tests
These tests simulate real user scenarios to validate the entire application flow.

- [ ] Test E: Description of end-to-end test E (e.g., "Test to ensure that a user can successfully complete the sign-up process")
- [ ] Test F: Description of end-to-end test F (e.g., "Test to verify that a user can create, update, and delete an item in the application")

### Manual Tests
These are tests that require a human to interact with the application to verify functionality.

- [ ] Test G: Description of manual test G (e.g., "Manually test the new feature to ensure it works as expected in the user interface")
- [ ] Test H: Description of manual test H (e.g., "Manually test the bug fix to ensure the issue is resolved and no new issues are introduced")

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
