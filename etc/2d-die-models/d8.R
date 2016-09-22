# Matrix of octahedron vertex coordinates (see
# https://en.wikipedia.org/wiki/Octahedron#Cartesian_coordinates).
vertices_3d = matrix(
  c(
    -1,  0,  0,     # (x1, y1, z1)
     1,  0,  0,
     0, -1,  0,
     0,  1,  0,
     0,  0, -1,
     0,  0,  1      # (x6, y6, z6)
  ),
  nrow=3,
  ncol=6
)

# Rotate die to generate 2D view from above while it is at rest on a surface
# (i.e. with top facet parallel to x-y plane).
rotate_z_pos_45 = matrix(
  c(
    cos(pi / 4), -sin(pi / 4), 0,
    sin(pi / 4),  cos(pi / 4), 0,
    0,            0,           1
  ),
  nrow=3,
  ncol=3,
  byrow=TRUE
)
dihedral_angle = acos(-1 / 3)
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
vertices_3d_rot = rotate_x_pos_half_dihedral %*% rotate_z_pos_45 %*% vertices_3d

# Extract 2D vertex coordinates and order them in such a way to optimize
# drawing.  The 2D vertices are as labeled below.  (**) represents the origin.
#
#                 ( 1)                          +--> x
#                                               |
#         ( 6)            ( 2)                  V
#                                               y
#                 (**)
#
#         ( 5)            ( 3)
#
#                 ( 4)
#
vertices_2d = matrix(
  c(
    vertices_3d_rot[1, 6], vertices_3d_rot[2, 6],     # (x'1, y'1)
    vertices_3d_rot[1, 3], vertices_3d_rot[2, 3],
    vertices_3d_rot[1, 2], vertices_3d_rot[2, 2],
    vertices_3d_rot[1, 5], vertices_3d_rot[2, 5],
    vertices_3d_rot[1, 4], vertices_3d_rot[2, 4],
    vertices_3d_rot[1, 1], vertices_3d_rot[2, 1]      # (x'6, y'6)
  ),
  nrow=2,
  ncol=6
)
