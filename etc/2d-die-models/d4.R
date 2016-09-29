# Matrix of regular tetrahedron vertex coordinates (see
# https://en.wikipedia.org/wiki/Tetrahedron#Formulas_for_a_regular_tetrahedron).
vertices_3d = matrix(
  c(
    -1,  0, -1 / sqrt(2),     # (x1, y1, z1)
     1,  0, -1 / sqrt(2),
     0, -1,  1 / sqrt(2),
     0,  1,  1 / sqrt(2)      # (x4, y4, z4)
  ),
  nrow=3,
  ncol=4
)

# Rotate die to generate 2D view from above while it is at rest on a surface
# (i.e. with bottom facet parallel to x-y plane).
# NB: This is the dihedral angle of an octahedron, half of which is the angle
# between facet (1, 2, 3) and the x-y plane.
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
vertices_3d_rot = rotate_x_pos_half_dihedral %*% vertices_3d

# Extract 2D vertex coordinates and order them in such a way to optimize
# drawing.  The 2D vertices are as labeled below.  (**) represents the origin.
#
#                 ( 2)                          +--> x
#                                               |
#                                               V
#                 ( 1)                          y
#
#         ( 4)            ( 3)
#
vertices_2d = matrix(
  c(
    vertices_3d_rot[1, 4], vertices_3d_rot[2, 4],     # (x'1, y'1)
    vertices_3d_rot[1, 3], vertices_3d_rot[2, 3],
    vertices_3d_rot[1, 2], vertices_3d_rot[2, 2],
    vertices_3d_rot[1, 1], vertices_3d_rot[2, 1]      # (x'4, y'4)
  ),
  nrow=2,
  ncol=4
)
