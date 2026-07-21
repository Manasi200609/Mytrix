/** Detects application frameworks and build tooling from manifest/config names. */
const FRAMEWORK_PACKAGES = {
  React: ['react','vite','react-dom'], 'Next.js': ['next.config.mjs','next.config.js','next.config.ts'], Express: ['express'], Vue: ['vue'],
  Angular: ['@angular/core'], FastAPI: ['fastapi'], Django: ['django'], Flask: ['flask'],
  'Spring Boot': ['spring-boot'], Laravel: ['laravel/framework'], 'ASP.NET': ['microsoft.aspnetcore'],
  Svelte: ['svelte'],
};
const BUILD_PACKAGES = { Vite: ['vite'], Webpack: ['webpack'], Rollup: ['rollup'], Parcel: ['parcel'], Turbopack: ['turbo', 'turbopack'] };

export function detectFrameworks(fileIndex, dependencyNames = []) {
  const names = new Set(dependencyNames.map((name) => name.toLowerCase()));
  const paths = new Set(fileIndex.map(({ relativePath }) => relativePath.toLowerCase()));
  return Object.entries(FRAMEWORK_PACKAGES)
    .filter(([framework, packages]) => {
      const hasPackage = packages.some((pkg) => names.has(pkg));
      const hasSpringBootFile = framework === 'Spring Boot' && (
        paths.has('pom.xml') || paths.has('build.gradle') || paths.has('build.gradle.kts')
      );
      const hasLaravelFile = framework === 'Laravel' && paths.has('artisan');
      const hasAspNetFile = framework === 'ASP.NET' && [...paths].some((file) => file.endsWith('.csproj'));

      return hasPackage || hasSpringBootFile || hasLaravelFile || hasAspNetFile;
    })
    .map(([framework]) => framework);
}
export function detectBuildTools(fileIndex, dependencyNames = []) {
  const names = new Set(dependencyNames.map((name) => name.toLowerCase()));
  const paths = fileIndex.map(({ fileName }) => fileName.toLowerCase());
  return Object.entries(BUILD_PACKAGES).filter(([tool, packages]) =>
    packages.some((pkg) => names.has(pkg)) || paths.some((file) => file.startsWith(tool.toLowerCase().replace('.', '')) && file.includes('config'))
  ).map(([tool]) => tool);
}
