from distutils.core import setup
from Cython.Build import cythonize

setup(ext_modules=cythonize(["interpolate.pyx","ruaumoko.pyx","solver.pyx","warnings.pyx"]))

