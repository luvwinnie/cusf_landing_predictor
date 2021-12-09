import os
import fnmatch
from distutils.core import setup
from distutils.extension import Extension
from Cython.Build import cythonize
from Cython.Distutils import build_ext

files = fnmatch.filter(os.listdir("./predictors"), "*.pyx")
submodules = [n[:-4] for n in files]
ext_modules = [Extension('predictors.' + sm, ["./predictors/"+sm + '.pyx'],include_dirs=["."])
               for sm in submodules]
# setup(ext_modules=cythonize(ext_modules))
print(ext_modules)
setup(name='predictors',
  cmdclass={'build_ext': build_ext},
  ext_modules=ext_modules,
  script_args=['build_ext'],
  options={'build_ext':{'inplace':True, 'force':True}})