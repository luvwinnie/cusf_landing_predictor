import os
import fnmatch
from distutils.core import setup
from distutils.extension import Extension
from Cython.Build import cythonize

files = fnmatch.filter(os.listdir("./predictors"), "*.pyx")
submodules = [n[:-4] for n in files]
ext_modules = [Extension('predictors.' + sm, ["./predictors/"+sm + '.pyx'])
               for sm in submodules]
setup(ext_modules=cythonize(ext_modules))