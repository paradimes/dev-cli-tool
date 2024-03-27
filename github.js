export async function createRepository(
  repoName,
  repoDescription,
  isPrivate,
  authToken
) {
  try {
    const response = await fetch(`https://api.github.com/user/repos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: repoName,
        description: repoDescription,
        private: isPrivate,
        auto_init: true,
        gitignore_template: "Node",
        license_template: "mit",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Repository ${repoName} created successfully.`);
      console.log(`URL: ${data.html_url}`);
      return data.clone_url;
    } else {
      const errorData = await response.json();
      console.error(`Error creating repository: ${errorData.message}`);
      console.error(`Status code: ${response.status}`);
      console.error(`Error details: ${JSON.stringify(errorData.errors)}`);
    }
  } catch (error) {
    console.error(`Error creating repository: ${error.message}`);
    console.error(`Error details: error`);
  }
}
