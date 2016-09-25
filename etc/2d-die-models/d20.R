# Matrix of regular icosahedron vertex coordinates (see
# https://en.wikipedia.org/wiki/Regular_icosahedron#Cartesian_coordinates).
phi = (1 + sqrt(5)) / 2
vertices_3d = matrix(
  c(
     0,   -1,   -phi,             # (x1, y1, z1)
     0,   -1,    phi,
     0,    1,   -phi,
     0,    1,    phi,
    -1,   -phi,  0,
    -1,    phi,  0,
     1,   -phi,  0,
     1,    phi,  0,
    -phi,  0,   -1,
     phi,  0,   -1,
    -phi,  0,    1,
     phi,  0,    1                # (x12, y12, z12)
  ),
  nrow=3,
  ncol=12
)

# Rotate die to generate 2D view from above while it is at rest on a surface
# (i.e. with top facet parallel to x-y plane).
dihedral_angle = acos(-sqrt(5) / 3)
rotate_x_pos_half_dihedral = matrix(
  c(
    1, 0,                        0,
    0, cos(dihedral_angle / 2), -sin(dihedral_angle / 2),
    0, sin(dihedral_angle / 2),  cos(dihedral_angle / 2)
  ),
  nrow=3,
  ncol=3,
  byrow=TRUE
)
vertices_3d_rot = rotate_x_pos_half_dihedral %*% vertices_3d

# Extract 2D vertex coordinates and order them in such a way to optimize
# drawing.  The 2D vertices are as labeled below.  (**) represents the origin.
#
#                 ( 4)                          +--> x
#                                               |
#                 ( 1)                          V
#  ( 9)                          ( 5)           y
#
#                 (**)
#         ( 3)            ( 2)
#  ( 8)                          ( 6)
#
#
#                 ( 7)
#
vertices_2d = matrix(
  c(
    vertices_3d_rot[1,  4], vertices_3d_rot[2,  4],     # (x'1, y'1)
    vertices_3d_rot[1,  8], vertices_3d_rot[2,  8],
    vertices_3d_rot[1,  6], vertices_3d_rot[2,  6],
    vertices_3d_rot[1,  2], vertices_3d_rot[2,  2],
    vertices_3d_rot[1, 12], vertices_3d_rot[2, 12],
    vertices_3d_rot[1, 10], vertices_3d_rot[2, 10],
    vertices_3d_rot[1,  3], vertices_3d_rot[2,  3],
    vertices_3d_rot[1,  9], vertices_3d_rot[2,  9],
    vertices_3d_rot[1, 11], vertices_3d_rot[2, 11]      # (x'9, y'9)
  ),
  nrow=2,
  ncol=9
)
